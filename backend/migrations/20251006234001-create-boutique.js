'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('boutiques', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nom: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false
      },
      adresse: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },
      telephone: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false
      },
      email: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
      },
      logo: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true
      },
      actif: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('boutiques');
  }
};