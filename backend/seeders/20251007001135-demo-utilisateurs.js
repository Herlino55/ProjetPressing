'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('utilisateurs', [
      {
        nom: 'Doe',
        prenom: 'John',
        email: 'john.doe@example.com',
        password: 'hashed_password',
        telephone: '690000001',
        role: 'admin',
        boutiqueId: 4,
        actif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Smith',
        prenom: 'Anna',
        email: 'anna.smith@example.com',
        password: 'hashed_password',
        role: 'employe',
        boutiqueId: 4,
        actif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('utilisateurs', null, {});
  }
};