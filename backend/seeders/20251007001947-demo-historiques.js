'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('historiques', [
      {
        utilisateurId: 8,
        boutiqueId: 4,
        typeAction: 'create',
        entite: 'commande',
        entiteId: 1,
        description: 'Création de la commande CMD001',
        detailsAvant: null,
        detailsApres: JSON.stringify({ statut: 'en_attente' }),
        createdAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('historiques', null, {});
  }
};