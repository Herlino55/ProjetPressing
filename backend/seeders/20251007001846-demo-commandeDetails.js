'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('commande_details', [
      {
        commandeId: 1,
        vetementId: 1,
        tarifId: 2,
        quantite: 2,
        prixUnitaire: 1000,
        sousTotal: 2000,
        notes: 'Chemises délicates',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('commande_details', null, {});
  }
};