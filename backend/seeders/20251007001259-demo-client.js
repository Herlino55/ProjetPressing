'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('clients', [
      {
        nom: 'Mbappe',
        prenom: 'Kylian',
        telephone: '690000002',
        email: 'k.mbappe@example.com',
        adresse: 'Bonapriso, Douala',
        boutiqueId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('clients', null, {});
  }
};