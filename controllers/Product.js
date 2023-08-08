const { Product } = require("../models");
const { Images } = require("../models");
const sequelize = require("../config/dbQuery");
const { QueryTypes } = require("sequelize");
const query = require("../controllers/query");
const { v4: uuid } = require("uuid");
const fs = require("fs").promises;

class Controller {
  static async addProduct(req, res, next) {
    // console.log(req, 'INI REQ DOANG')
    const tx = await sequelize.transaction();
    try {
      let { title, description } = req.body;

      if (!req.files) {
        return res
          .status(500)
          .json({ message: "Product Image needs to be uploaded" });
      }

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
        imagePath: req.files.sampleFile1[0].path,
        imageName: req.files.sampleFile1[0].filename,
        category: "01",
      };

      let imageIklan = {
        id: id,
        id_image: id_image2,
        imagePath: req.files.sampleFile2[0].path,
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
            imagePath: req.files.sampleFile1[0].path,
            imageName: req.files.sampleFile1[0].filename,
          };
        }

        if (req.files.sampleFile2 !== undefined) {
          updateImageIklan = {
            imagePath: req.files.sampleFile2[0].path,
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
    const tx = await sequelize.transaction();
    try {
      let image = await sequelize.query(query.getImageProd, {
        type: QueryTypes.SELECT,
        replacements: { id },
      });

      for (let i = 0; i < image.length; i++) {
        await fs.unlink(image[i].imagePath);
      }

      await Product.destroy({ where: { id } });
      await Images.destroy({ where: { id } });
      await tx.commit();
      return res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }
}

module.exports = Controller;
