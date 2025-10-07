'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('utilisateurs', {
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
      email: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false
      },
      telephone: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true
      },
      role: {
        type: Sequelize.DataTypes.ENUM('admin', 'gerant', 'employe'),
        allowNull: false,
        defaultValue: 'employe'
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
    await queryInterface.dropTable('utilisateurs');
  }
};