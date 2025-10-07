'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tarifs', [
      {
        vetementId: 2,
        boutiqueId: 4,
        typeService: 'repassage',
        prix: 1000,
        actif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tarifs', null, {});
  }
};