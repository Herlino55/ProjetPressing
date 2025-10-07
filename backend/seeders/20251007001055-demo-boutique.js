'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('boutiques', [
      {
        nom: 'Pressing Douala',
        adresse: 'Rue de la Gare, Douala',
        telephone: '690000000',
        email: 'contact@pressingdouala.cm',
        logo: null,
        actif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('boutiques', null, {});
  }
};