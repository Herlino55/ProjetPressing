'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('vetements', 'boutiqueId', {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'boutiques',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('vetements', 'boutiqueId');
  }
};