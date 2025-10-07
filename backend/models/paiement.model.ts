import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Commande from './commande.model';

export enum MethodePaiement {
  ESPECE = 'espece',
  CARTE = 'carte',
  MOBILE_MONEY = 'mobile money',
  ORANGE_MONEY = 'orange money',
  VIREMENT = 'virement',
  CHEQUE = 'cheque'
}

export enum StatutPaiement {
  EN_ATTENTE = 'en_attente',
  PAYE = 'paye',
  PARTIEL = 'partiel',
  REMBOURSE = 'rembourse'
}

interface PaiementAttributes {
  id: number;
  commandeId: number;
  montant: number;
  methodePaiement: MethodePaiement;
  statut: StatutPaiement;
  reference?: string;
  datePaiement: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaiementCreationAttributes extends Optional<PaiementAttributes, 'id' | 'reference' | 'notes' | 'datePaiement'> {}

class Paiement extends Model<PaiementAttributes, PaiementCreationAttributes> implements PaiementAttributes {
  public id!: number;
  public commandeId!: number;
  public montant!: number;
  public methodePaiement!: MethodePaiement;
  public statut!: StatutPaiement;
  public reference?: string;
  public datePaiement!: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Paiement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    commandeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'commandes',
        key: 'id'
      }
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    methodePaiement: {
      type: DataTypes.ENUM(...Object.values(MethodePaiement)),
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM(...Object.values(StatutPaiement)),
      allowNull: false,
      defaultValue: StatutPaiement.EN_ATTENTE
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    datePaiement: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'paiements',
    timestamps: true
  }
);

Paiement.belongsTo(Commande, { foreignKey: 'commandeId', as: 'commande' });
Commande.hasMany(Paiement, { foreignKey: 'commandeId', as: 'paiements' });

export default Paiement;
