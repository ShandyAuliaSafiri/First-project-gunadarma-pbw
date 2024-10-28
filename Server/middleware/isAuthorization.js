const { Trip } = require('../models');

const { User } = require('../models');

async function isAuthorizedAdmin(req, res, next) {
  try {
    if (!req.user) {
      throw { name: "unauthorized", message: "User is not authenticated" };
    }
    let user = await User.findByPk(req.user.id);
    if (!user) {
      throw { name: "unauthorized", message: "User not found" };
    }
    req.user = user.dataValues;
    console.log(req.user, ">>>requs");
    
    if (req.user.role !== "admin") {
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}


async function isAuthorized(req, res, next) {
  try {
    console.log(req.user);
    
    if (req.user.role !== "admin") {
      let trip = await Trip.findByPk(req.params.id);
      if (!trip) {
        throw { name: "not-found" };
      }
      if (trip.user_id !== req.user.id) {
        throw { name: "forbidden" };
      }
      next();
    }
    if (req.user.role === "admin") {
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { isAuthorized, isAuthorizedAdmin };


