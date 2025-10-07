'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vetements', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nom: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true
      },
      image: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vetements');
  }
};