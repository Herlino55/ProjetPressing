'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('commandes', [
      {
        clientId: 3,
        boutiqueId: 4,
        utilisateurId: 15,
        numeroCommande: 'CMD001',
        statut: 'en_attente',
        montantTotal: 5000,
        dateDepot: new Date(),
        dateRetrait: null,
        notes: 'Client pressé',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('commandes', null, {});
  }
};