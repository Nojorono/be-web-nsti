const { career } = require("../models");
const { Images } = require("../models");
const sequelize = require("../config/dbQuery");
const { QueryTypes } = require("sequelize");
const query = require("../controllers/query");
const { v4: uuid } = require("uuid");
const fs = require("fs");

class Controller {
  static async addcareer(req, res, next) {
    const tx = await sequelize.transaction();
    try {
      let { title, description, link, location, level } = req.body;

      let id = uuid();

      let careerInput = {
        id: id,
        title: title,
        description: description,
        // link: link,
        location: location,
        // level: level
      };

      await career.create(careerInput);

      await tx.commit();
      return res.status(200).json({
        career: careerInput,
      });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async Allcareer(req, res, next) {
    const { page, size } = req.query;
    const pageNum = Number(page);
    const pageSize = Number(size);
    try {
      let data = await sequelize.query(query.getCareer, {
        type: QueryTypes.SELECT,
        replacements: { pageNum, pageSize },
      });

      let count = await sequelize.query(query.countCareer, {
        type: QueryTypes.SELECT,
      });

      console.log(pageSize, count);
      let pagesleft = Math.ceil(count[0]["COUNT(*)"] / pageSize);

      return res
        .status(200)
        .json({ data, totalcontent: count, pagesLeft: pagesleft });
    } catch (err) {
      next(err);
    }
  }

  static async careerById(req, res, next) {
    let { id } = req.params;
    try {
      const [career] = await Promise.all([
        sequelize.query(query.getCareerDetail, {
          type: QueryTypes.SELECT,
          replacements: { id },
        }),
      ]);
      return res.status(200).json(career);
    } catch (err) {
      next(err);
    }
  }

  static async careerUpdate(req, res, next) {
    let id = req.body.id;
    const tx = await sequelize.transaction();
    try {
      let updateInput = {
        title: req.body.title,
        description: req.body.description,
        // level: req.body.level,
        location: req.body.location,
      };

      await career.update(updateInput, {
        where: { id },
        returning: true,
      });

      await tx.commit();
      return res.status(200).json({ message: "updated succeed" });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }

  static async deletecareer(req, res, next) {
    let { id } = req.body;
    console.log(req.body, "MASUK DELETE");
    const tx = await sequelize.transaction();
    try {
      await career.destroy({ where: { id } });
      await tx.commit();
      return res.status(200).json({ message: "career deleted" });
    } catch (err) {
      await tx.rollback();
      next(err);
    }
  }
}

module.exports = Controller;
