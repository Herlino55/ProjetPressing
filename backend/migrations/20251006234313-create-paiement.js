'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('paiements', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      commandeId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'commandes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      montant: {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      methodePaiement: {
        type: Sequelize.DataTypes.ENUM('espece', 'carte', 'mobile', 'virement', 'cheque'),
        allowNull: false
      },
      statut: {
        type: Sequelize.DataTypes.ENUM('en_attente', 'paye', 'partiel', 'rembourse'),
        allowNull: false,
        defaultValue: 'en_attente'
      },
      reference: {
        type: Sequelize.DataTypes.STRING(100),
        allowNull: true
      },
      datePaiement: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW
      },
      notes: {
        type: Sequelize.DataTypes.TEXT,
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
    await queryInterface.dropTable('paiements');
  }
};