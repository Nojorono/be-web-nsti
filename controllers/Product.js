const { Product } = require("../models");
const { Images } = require("../models");
const sequelize = require("../config/dbQuery");
const { QueryTypes } = require("sequelize");
const query = require("../controllers/query");
const { v4: uuid } = require("uuid");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");

class Controller {
  static async addProduct(req, res, next) {
    // console.log(req, 'INI REQ DOANG')
    const tx = await sequelize.transaction();
    try {
      let { title, description } = req.body;

      console.log("=== UPLOAD PRODUCT DEBUG ===");
      console.log("req.files:", req.files);
      console.log("req.body:", req.body);

      if (!req.files) {
        console.error("ERROR: No files uploaded!");
        return res
          .status(500)
          .json({ message: "Product Image needs to be uploaded" });
      }

      if (!req.files.sampleFile1 || !req.files.sampleFile2) {
        console.error("ERROR: Missing required files!");
        console.log("- sampleFile1:", req.files.sampleFile1 ? "exists" : "missing");
        console.log("- sampleFile2:", req.files.sampleFile2 ? "exists" : "missing");
        return res
          .status(500)
          .json({ message: "Both product images need to be uploaded" });
      }

      console.log("Files uploaded successfully:");
      console.log("- sampleFile1:", req.files.sampleFile1[0].filename, "at", req.files.sampleFile1[0].path);
      console.log("- sampleFile2:", req.files.sampleFile2[0].filename, "at", req.files.sampleFile2[0].path);

      let id = uuid();
      let id_image1 = uuid();
      let id_image2 = uuid();

      let productInput = {
        id: id,
        title: title,
        description: description,
      };

      let imageProduct = {
        id: id,
        id_image: id_image1,
        imagePath: `image/${req.files.sampleFile1[0].filename}`, // Store relative path for consistency
        imageName: req.files.sampleFile1[0].filename,
        category: "01",
      };

      let imageIklan = {
        id: id,
        id_image: id_image2,
        imagePath: `image/${req.files.sampleFile2[0].filename}`, // Store relative path for consistency
        imageName: req.files.sampleFile2[0].filename,
        category: "02",
      };

      await Product.create(productInput);
      await Images.create(imageProduct);
      await Images.create(imageIklan);

      await tx.commit();

      return res.status(200).json({
        product: productInput,
        imageProduct: imageProduct,
        imageIklan: imageIklan,
      });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async AllProduct(req, res, next) {
    try {
      let data = await sequelize.query(query.getProd, {
        type: QueryTypes.SELECT,
      });

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async ProductById(req, res, next) {
    let { id } = req.params;
    try {
      const [Product, Images] = await Promise.all([
        sequelize.query(query.getProducts, {
          type: QueryTypes.SELECT,
          replacements: { id },
        }),
        sequelize.query(query.getImages, {
          type: QueryTypes.SELECT,
          replacements: { id },
        }),
      ]);

      Product[0].images = Images;

      let result = Product;

      // console.log(Product,'INI PRODUCT')

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async ProductUpdate(req, res, next) {
    let id = req.body.id;
    const tx = await sequelize.transaction();
    try {
      let updateInput = {
        title: req.body.title,
        description: req.body.description,
      };

      if (req.files === undefined) {
        // UPDATE WITHOUT IMAGE
        await Product.update(updateInput, {
          where: { id },
          returning: true,
        });
        await tx.commit();
        return res.status(200).json({ message: updateInput });
      } else {
        // UPDATE WITH IMAGE
        await Product.update(updateInput, {
          where: { id },
          returning: true,
        });

        // variable for update image
        let updateImageProduct;
        let updateImageIklan;

        if (req.files.sampleFile1 !== undefined) {
          updateImageProduct = {
            imagePath: `image/${req.files.sampleFile1[0].filename}`, // Store relative path for consistency
            imageName: req.files.sampleFile1[0].filename,
          };
        }

        if (req.files.sampleFile2 !== undefined) {
          updateImageIklan = {
            imagePath: `image/${req.files.sampleFile2[0].filename}`, // Store relative path for consistency
            imageName: req.files.sampleFile2[0].filename,
          };
        }

        await Images.update(updateImageProduct, {
          where: {
            id: id,
            category: "01",
          },
          returning: true,
        });
        await Images.update(updateImageIklan, {
          where: {
            id: id,
            category: "02",
          },
          returning: true,
        });
        await tx.commit();
        return res.status(200).json({
          message: "updated succeed with image",
          imageProduct: updateImageProduct,
          updateImageIklan: updateImageIklan,
        });
      }
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async deleteProduct(req, res, next) {
    let { id } = req.body;
    console.log("=== DELETE PRODUCT DEBUG ===");
    console.log("Product ID:", id);
    console.log("req.body:", req.body);
    
    const tx = await sequelize.transaction();
    try {
      if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // Query to get all images for this product (by product id, not image id)
      let image = await sequelize.query(
        `select i.imagePath, i.category, i.imageName from Images i
         where i.id = :id`,
        {
          type: QueryTypes.SELECT,
          replacements: { id },
        }
      );

      console.log("Images found:", image.length);
      console.log("Images data:", image);

      // Delete image files if they exist
      if (image && image.length > 0) {
        for (let i = 0; i < image.length; i++) {
          if (image[i].imagePath) {
            // Normalize path - handle both backslash and forward slash
            let imagePath = image[i].imagePath.replace(/\\/g, '/');
            // Remove 'image/' prefix if exists to avoid double path
            if (imagePath.startsWith('image/')) {
              imagePath = imagePath.substring(6); // Remove 'image/' prefix
            }
            const fullPath = path.join(__dirname, '..', 'image', imagePath);
            console.log("Deleting image at:", fullPath);
            console.log("Original path from DB:", image[i].imagePath);
            
            if (fsSync.existsSync(fullPath)) {
              await fs.unlink(fullPath);
              console.log("Image deleted successfully");
            } else {
              console.warn("Image file not found:", fullPath);
            }
          }
        }
      }

      // Delete from database
      await Product.destroy({ where: { id } });
      await Images.destroy({ where: { id } });
      await tx.commit();
      
      console.log("Product deleted successfully");
      return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      await tx.rollback();
      console.error("Error deleting product:", err);
      console.error("Error stack:", err.stack);
      next(err);
    }
  }
}

module.exports = Controller;
