'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('vetements', [
      {
        nom: 'Chemise blanche',
        description: 'Chemise coton à repasser',
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('vetements', null, {});
  }
};