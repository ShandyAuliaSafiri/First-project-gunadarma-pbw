const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helper/bcrypt");
const { signToken } = require("../helper/jwt");

class UserController {
  static async register(req, res, next) {
    try {
    //   Check if requester is admin
      if (req.user.role !== 'admin') {
        throw { name: "unauthorized" };
      }
      console.log(req.user,">>>");
      

      const { email, password, role, firstName, lastName, dateOfBirth } = req.body;
     console.log(req.body,">>");

      if (!email || !password) {
        throw { name: "no-email/password" };
      }

      // Validate role
      if (role !== 'admin' && role !== 'user') {
        throw { name: "invalid-role" };
      }

      const user = await User.create({
        email,
        password: hashPassword(password),
        role,
        firstName,
        lastName,
        dateOfBirth
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth
      });
    } catch (error) {
      next(error);
    //   res.send(error)
    //   // console.log(error);
      
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(req.body,"body>>>>");
      console.log("Email yang dimasukkan:", email);
      
      if (!email) {
        throw { name: "login-wrong" };
      }

      if (!password) {
        throw { name: "login-error" };
      }

      const user = await User.findOne({
        where: { email },
      });
      console.log(user,"user>>>>");
      console.log("Password dari request:", password);
      console.log("Password yang tersimpan:", user.password);
      
      if (!user) {
        throw { name: "login-failed" };
      }
      

      const isPasswordValid = comparePassword(password, user.password);
      console.log(isPasswordValid,"hasil compare password>>.");
      

      if (!isPasswordValid) {
        throw { name: "login-failed" };
      }

      const access_token = signToken({
        id: user.id,
        email: user.email,
        role: user.role
      });

      res.status(200).json({
        access_token,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        dateOfBirth: user.dateOfBirth
      });
    } catch (error) {
      next(error);
    //   res.send(error)
    //   console.log(error);
      
    }
  }
}

module.exports = UserController;
