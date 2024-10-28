const { Trip, User } = require("../models");

class TripController {
  // Public Methods - Read Only
  static async getPublicTrips(req, res, next) {
    try {
      const trips = await Trip.findAll({
        include: [
          {
            model: User,
            attributes: ["firstName", "lastName"]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json(trips);
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
      const trips = await Trip.findAll({
        include: [
          {
            model: User,
            attributes: ["email", "firstName", "lastName", "role", "dateOfBirth"]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      
      res.status(200).json(trips);
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
      const { trip_name, content, imageUrl } = req.body;
      
      if (!trip_name || !content || !imageUrl) {
        throw { name: "validation-error", message: "Semua field harus diisi" };
      }

      const userId = req.user.id;

      const trip = await Trip.create({
        trip_name,
        content,
        imageUrl,
        user_id: userId
      });

      res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  }

  static async updateCMSTrip(req, res, next) {
    try {
      const { id } = req.params;
      const { trip_name, content, imageUrl } = req.body;

      if (!trip_name || !content || !imageUrl) {
        throw { name: "validation-error", message: "Semua field harus diisi" };
      }

      const trip = await Trip.findByPk(id);
      if (!trip) throw { name: "not-found" };

      await Trip.update({
        trip_name,
        content,
        imageUrl
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
