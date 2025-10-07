'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nom: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false
      },
      prenom: {
        type: Sequelize.DataTypes.STRING(50),
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
      adresse: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true
      },
      boutiqueId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'boutiques',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('clients');
  }
};