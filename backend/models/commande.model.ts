import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Client from './client.model';
import Boutique from './boutique.model';
import Utilisateur from './utilisateur.model';

export enum StatutCommande {
  EN_ATTENTE = 'en_attente',
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  LIVRE = 'livre',
  ANNULE = 'annule'
}

interface CommandeAttributes {
  id: number;
  clientId: number;
  boutiqueId: number;
  utilisateurId: number;
  numeroCommande: string;
  statut: StatutCommande;
  montantTotal: number;
  dateDepot: Date;
  dateRetrait?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommandeCreationAttributes extends Optional<CommandeAttributes, 'id' | 'dateRetrait' | 'notes' | 'montantTotal'> {}

class Commande extends Model<CommandeAttributes, CommandeCreationAttributes> implements CommandeAttributes {
  public id!: number;
  public clientId!: number;
  public boutiqueId!: number;
  public utilisateurId!: number;
  public numeroCommande!: string;
  public statut!: StatutCommande;
  public montantTotal!: number;
  public dateDepot!: Date;
  public dateRetrait?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Commande.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    },
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'boutiques',
        key: 'id'
      }
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateurs',
        key: 'id'
      }
    },
    numeroCommande: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    statut: {
      type: DataTypes.ENUM(...Object.values(StatutCommande)),
      allowNull: false,
      defaultValue: StatutCommande.EN_ATTENTE
    },
    montantTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    dateDepot: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dateRetrait: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'commandes',
    timestamps: true
  }
);

Commande.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Commande.belongsTo(Boutique, { foreignKey: 'boutiqueId', as: 'boutique' });
Commande.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
Client.hasMany(Commande, { foreignKey: 'clientId', as: 'commandes' });
Boutique.hasMany(Commande, { foreignKey: 'boutiqueId', as: 'commandes' });
Utilisateur.hasMany(Commande, { foreignKey: 'utilisateurId', as: 'commandes' });

export default Commande;
