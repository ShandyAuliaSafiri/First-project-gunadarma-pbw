const { Trip, User } = require("../models");
const { Op } = require("sequelize");

class TripController {
  // Public Methods - Read Only
  static async getPublicTrips(req, res, next) {
    try {
      const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "DESC", negara = "" } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {
        [Op.or]: [
          { trip_name: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } }
        ]
      };

      if (negara) {
        whereClause.negara = { [Op.iLike]: `%${negara}%` };
      }

      const trips = await Trip.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"]
          }
        ],
        order: [[sortBy, sortOrder], ['rating', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        totalItems: trips.count,
        totalPages: Math.ceil(trips.count / limit),
        currentPage: parseInt(page),
        trips: trips.rows
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicTripById(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"] // Fixed to match User model attributes
          }
        ]
      });

      if (!trip) throw { name: "not-found" };

      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  }

  // CMS Methods - Full CRUD
  static async getCMSTrips(req, res, next) {
    try {
      const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "DESC", negara = "" } = req.query;
      const offset = (page - 1) * limit;

      const whereClause = {
        [Op.or]: [
          { trip_name: { [Op.iLike]: `%${search}%` } },
          { content: { [Op.iLike]: `%${search}%` } }
        ]
      };

      if (negara) {
        whereClause.negara = { [Op.iLike]: `%${negara}%` };
      }

      const trips = await Trip.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            attributes: ["email", "firstName", "lastName", "role", "dateOfBirth"]
          }
        ],
        order: [[sortBy, sortOrder], ['rating', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.status(200).json({
        totalItems: trips.count,
        totalPages: Math.ceil(trips.count / limit),
        currentPage: parseInt(page),
        trips: trips.rows
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCMSTripById(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["email", "firstName", "lastName", "role", "dateOfBirth"] // Added missing attributes
          }
        ]
      });

      if (!trip) throw { name: "not-found" };

      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  }

  static async createCMSTrip(req, res, next) {
    try {
      const { trip_name, content, imageUrl, negara, rating } = req.body;
      
      if (!trip_name || !content || !imageUrl || !negara) {
        throw { name: "validation-error", message: "Semua field harus diisi" };
      }

      const userId = req.user.id;

      const trip = await Trip.create({
        trip_name,
        content,
        imageUrl,
        negara,
        user_id: userId,
        rating
      });

      res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  }

  static async updateCMSTrip(req, res, next) {
    try {
      const { id } = req.params;
      const { trip_name, content, imageUrl, negara, rating } = req.body;

      if (!trip_name || !content || !imageUrl || !negara) {
        throw { name: "validation-error", message: "Semua field harus diisi" };
      }

      const trip = await Trip.findByPk(id);
      if (!trip) throw { name: "not-found" };

      await Trip.update({
        trip_name,
        content,
        imageUrl,
        negara,
        rating
      }, {
        where: { id }
      });

      res.status(200).json({ message: `Artikel dengan ID ${id} berhasil diperbarui` });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCMSTrip(req, res, next) {
    try {
      const { id } = req.params;

      const trip = await Trip.findByPk(id);
      if (!trip) throw { name: "not-found" };

      await Trip.destroy({
        where: { id }
      });

      res.status(200).json({ message: `Artikel dengan ID ${id} berhasil dihapus` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
