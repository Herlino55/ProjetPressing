import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Commande from './commande.model';
import Vetement from './vetement.model';
import Tarif from './tarif.model';

interface CommandeDetailAttributes {
  id: number;
  commandeId: number;
  vetementId: number;
  tarifId: number;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommandeDetailCreationAttributes extends Optional<CommandeDetailAttributes, 'id' | 'notes' | 'sousTotal'> {}

class CommandeDetail extends Model<CommandeDetailAttributes, CommandeDetailCreationAttributes> implements CommandeDetailAttributes {
  public id!: number;
  public commandeId!: number;
  public vetementId!: number;
  public tarifId!: number;
  public quantite!: number;
  public prixUnitaire!: number;
  public sousTotal!: number;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CommandeDetail.init(
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
    vetementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vetements',
        key: 'id'
      }
    },
    tarifId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tarifs',
        key: 'id'
      }
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    prixUnitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    sousTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'commande_details',
    timestamps: true
  }
);

CommandeDetail.belongsTo(Commande, { foreignKey: 'commandeId', as: 'commande' });
CommandeDetail.belongsTo(Vetement, { foreignKey: 'vetementId', as: 'vetement' });
CommandeDetail.belongsTo(Tarif, { foreignKey: 'tarifId', as: 'tarif' });
Commande.hasMany(CommandeDetail, { foreignKey: 'commandeId', as: 'details' });

export default CommandeDetail;
