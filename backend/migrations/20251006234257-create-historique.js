'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('historiques', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      utilisateurId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'utilisateurs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      boutiqueId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'boutiques',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      typeAction: {
        type: Sequelize.DataTypes.ENUM('create', 'update', 'delete', 'login', 'logout'),
        allowNull: false
      },
      entite: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false
      },
      entiteId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      detailsAvant: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: true
      },
      detailsApres: {
        type: Sequelize.DataTypes.JSONB,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('historiques');
  }
};