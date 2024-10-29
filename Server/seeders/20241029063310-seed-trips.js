"use strict";
const trips = require("../trips.json"); 

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Trips", trips, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Trips", null, {});
  },
};
