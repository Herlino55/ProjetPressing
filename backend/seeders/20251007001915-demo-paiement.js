'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('paiements', [
      {
        commandeId: 2,
        montant: 2000,
        methodePaiement: 'espece',
        statut: 'paye',
        reference: 'PAY001',
        datePaiement: new Date(),
        notes: 'Paiement complet',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('paiements', null, {});
  }
};