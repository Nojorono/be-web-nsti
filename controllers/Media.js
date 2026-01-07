const { media } = require("../models");
const { Images } = require("../models");
const sequelize = require("../config/dbQuery");
const { QueryTypes } = require("sequelize");
const query = require("../controllers/query");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

class Controller {
  static async filterMedia(req, res, next) {
    try {
    } catch (err) {}
  }

  static async addmedia(req, res, next) {
    const tx = await sequelize.transaction();
    try {
      let { title, description, location } = req.body;

      console.log("=== UPLOAD MEDIA DEBUG ===");
      console.log("req.file:", req.file);
      console.log("req.body:", req.body);

      if (!req.file) {
        console.error("ERROR: No file uploaded!");
        return res
          .status(500)
          .json({ message: "media Image needs to be uploaded" });
      }

      console.log("File uploaded successfully:");
      console.log("- filename:", req.file.filename);
      console.log("- path:", req.file.path);
      console.log("- size:", req.file.size);
      console.log("- mimetype:", req.file.mimetype);

      let id = uuid();
      let id_image = uuid();

      let mediaInput = {
        id: id,
        title: title,
        description: description,
        location: location,
      };

      let imageInput = {
        id: id,
        id_image: id_image,
        imagePath: `image/${req.file.filename}`, // Store relative path for consistency
        imageName: req.file.filename,
        category: "03",
      };
      await media.create(mediaInput);
      await Images.create(imageInput);
      await tx.commit();
      return res.status(200).json({
        media: mediaInput,
        image: imageInput,
      });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async Allmedia(req, res, next) {
    const { page, size } = req.query;
    const { fDate, sDate } = req.body;

    const pageNum = Number(page) || 0;
    const pageSize = Number(size) || 6;
    
    // Calculate offset properly
    const offset = pageNum * pageSize;
    
    try {
      if (!fDate || !sDate) {
        console.log("masuk");

        let data = await sequelize.query(query.getMedia, {
          type: QueryTypes.SELECT,
          replacements: { pageNum: offset, pageSize },
        });
        let count = await sequelize.query(query.getCountMedia, {
          type: QueryTypes.SELECT,
        });

        console.log(pageSize, count);
        let pagesleft = Math.ceil(count[0]["COUNT(*)"] / pageSize);

        return res
          .status(200)
          .json({
            data,
            totalcontent: count[0]["COUNT(*)"],
            pagesleft: pagesleft,
          });
      }

      let data = await sequelize.query(query.mediaDate, {
        type: QueryTypes.SELECT,
        replacements: { pageNum: offset, pageSize, fDate, sDate },
      });
      let dataCount = await sequelize.query(query.getCountMediaDate, {
        type: QueryTypes.SELECT,
        replacements: { pageNum, pageSize, fDate, sDate },
      });

      let pagesleft = Math.ceil(dataCount[0]["COUNT(*)"] / pageSize);

      return res
        .status(200)
        .json({
          data,
          totalcontent: dataCount[0]["COUNT(*)"],
          pagesleft: pagesleft,
        });
    } catch (err) {
      next(err);
    }
  }

  static async mediaById(req, res, next) {
    let { id } = req.params;
    try {
      const [media] = await Promise.all([
        sequelize.query(query.getMediaDetail, {
          type: QueryTypes.SELECT,
          replacements: { id },
        }),
      ]);
      return res.status(200).json(media);
    } catch (err) {
      next(err);
    }
  }

  static async mediaUpdate(req, res, next) {
    let id = req.body.id;
    const tx = await sequelize.transaction();
    try {
      let updateInput = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
      };

      if (!req.file) {
        console.log("TRUE MASUK");

        await media.update(updateInput, {
          where: { id },
          returning: true,
        });
        await tx.commit();
        return res.status(200).json({ message: updateInput });
      }

      let imageData = await sequelize.query(
        `
            select i.imagePath from Images i
            where i.id ='${id}'`,
        { type: QueryTypes.SELECT }
      );

      console.log(imageData[0].imagePath, "INI IMAGE ATA");

      // Normalize path - handle both backslash and forward slash
      let imagePath = imageData[0].imagePath.replace(/\\/g, '/');
      // Remove 'image/' prefix if exists to avoid double path
      if (imagePath.startsWith('image/')) {
        imagePath = imagePath.substring(6); // Remove 'image/' prefix
      }
      const fullPath = path.join(__dirname, '..', 'image', imagePath);
      console.log("Deleting image at:", fullPath);
      console.log("Original path from DB:", imageData[0].imagePath);
      
      if (fs.existsSync(fullPath)) {
        await fs.unlinkSync(fullPath);
        console.log("Image deleted successfully");
      } else {
        console.warn("Image file not found:", fullPath);
      }

      await media.update(updateInput, {
        where: { id },
        returning: true,
      });
      console.log(req.file, "INI IMAGE PATH");
      let updateImage = {
        imagePath: `image/${req.file.filename}`, // Store relative path for consistency
        imageName: req.file.filename,
      };

      await Images.update(updateImage, {
        where: { id },
        returning: true,
      });
      await tx.commit();
      return res.status(200).json({ message: "updated succeed with image" });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async deletemedia(req, res, next) {
    let { id } = req.body;
    console.log(req.body, "MASUK DELETE");
    const tx = await sequelize.transaction();
    try {
      let image = await sequelize.query(query.getImage, {
        type: QueryTypes.SELECT,
        replacements: { id },
      });

      await media.destroy({ where: { id } });
      await Images.destroy({ where: { id } });
      
      // Normalize path - handle both backslash and forward slash
      let imagePath = image[0].imagePath.replace(/\\/g, '/');
      // Remove 'image/' prefix if exists to avoid double path
      if (imagePath.startsWith('image/')) {
        imagePath = imagePath.substring(6); // Remove 'image/' prefix
      }
      const fullPath = path.join(__dirname, '..', 'image', imagePath);
      console.log("Deleting image at:", fullPath);
      console.log("Original path from DB:", image[0].imagePath);
      
      if (fs.existsSync(fullPath)) {
        await fs.unlinkSync(fullPath);
        console.log("Image deleted successfully");
      } else {
        console.warn("Image file not found:", fullPath);
      }
      await tx.commit();
      return res.status(200).json({ message: "media deleted" });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }
}

module.exports = Controller;
