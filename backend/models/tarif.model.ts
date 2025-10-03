import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Vetement from './vetement.model';
import Boutique from './boutique.model';

export enum TypeService {
  LAVAGE = 'lavage',
  REPASSAGE = 'repassage',
  NETTOYAGE_SEC = 'nettoyage_sec',
  DETACHAGE = 'detachage',
  PRESSING_COMPLET = 'pressing_complet'
}

interface TarifAttributes {
  id: number;
  vetementId: number;
  boutiqueId: number;
  typeService: TypeService;
  prix: number;
  actif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TarifCreationAttributes extends Optional<TarifAttributes, 'id' | 'actif'> {}

class Tarif extends Model<TarifAttributes, TarifCreationAttributes> implements TarifAttributes {
  public id!: number;
  public vetementId!: number;
  public boutiqueId!: number;
  public typeService!: TypeService;
  public prix!: number;
  public actif!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tarif.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    vetementId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vetements',
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
    typeService: {
      type: DataTypes.ENUM(...Object.values(TypeService)),
      allowNull: false
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'tarifs',
    timestamps: true
  }
);

Tarif.belongsTo(Vetement, { foreignKey: 'vetementId', as: 'vetement' });
Tarif.belongsTo(Boutique, { foreignKey: 'boutiqueId', as: 'boutique' });
Vetement.hasMany(Tarif, { foreignKey: 'vetementId', as: 'tarifs' });
Boutique.hasMany(Tarif, { foreignKey: 'boutiqueId', as: 'tarifs' });

export default Tarif;
