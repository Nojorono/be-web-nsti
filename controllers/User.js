const { User } = require("../models");
const sequelize = require("../config/dbQuery");
const { QueryTypes } = require("sequelize");
const helpers = require("../helpers/helper");
const { generateToken } = require("../helpers/jwt");
const { v4: uuid } = require("uuid");

class Controller {
  static register(req, res, next) {
    let { email, username, password, first_name, last_name } = req.body;
    console.log(req.body, email, "INI EMAIL");
    let id = uuid();
    User.create({
      id: id,
      email: email,
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
    })
      .then((data) => {
        res.status(201).json({ data });
      })
      .catch(next);
  }
  static async login(req, res, next) {
    console.log("INI MASUK");
    try {
      let { email, password } = req.body;
      console.log(req.body, "INI BODY");
      User.findOne({
        where: { email },
      })
        .then((data) => {
          if (!data) {
            console.log("INI MASUK SALAH DATA GAADA");
            next({ name: "invalid Email/Password" });
          } else {
            console.log("INI MASUK CEKPASS");
            if (helpers.comparePassword(password, data.password)) {
              let payload = {
                id: data.id,
                email: email,
              };
              console.log("INI MASUK  OKECEKPASS");
              let access_token = generateToken(payload);
              res.status(200).json({ access_token });
            } else {
              console.log("INI MASUK INVALID SEMUA");
              next({ name: "invalid Email/Password" });
            }
          }
        })
        .catch(next);
    } catch (err) {
      console.log("MASUK ERR");
      next(err);
    }
  }

  static async viewUser(req, res, next) {
    try {
      console.log("MASUK");
      let data = await sequelize.query(`select * from "Users" `, {
        type: QueryTypes.SELECT,
      });
      console.log(data, " INI DATA");
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json(err.message);
    }
  }
}

module.exports = Controller;
