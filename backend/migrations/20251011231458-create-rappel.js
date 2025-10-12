'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rappels', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: Sequelize.DataTypes.ENUM(
          'commande_prete',
          'non_retrait',
          'fidelisation',
          'paiement',
          'alerte_rendement'
        ),
        allowNull: false,
      },
      boutiqueId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'boutiques',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      clientId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      commandeId: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'commandes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      statut: {
        type: Sequelize.DataTypes.ENUM('envoyé', 'échec'),
        allowNull: false,
        defaultValue: 'envoyé',
      },
      canal: {
        type: Sequelize.DataTypes.ENUM('whatsapp'),
        allowNull: false,
        defaultValue: 'whatsapp',
      },
      message: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      dateEnvoi: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.DataTypes.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rappels');
  },
};
