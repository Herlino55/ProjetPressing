import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Utilisateur from './utilisateur.model';
import Boutique from './boutique.model';

export enum TypeAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout'
}

interface HistoriqueAttributes {
  id: number;
  utilisateurId?: number;
  boutiqueId?: number;
  typeAction: TypeAction;
  entite: string;
  entiteId?: number;
  description: string;
  detailsAvant?: any;
  detailsApres?: any;
  createdAt?: Date;
}

interface HistoriqueCreationAttributes extends Optional<HistoriqueAttributes, 'id' | 'utilisateurId' | 'boutiqueId' | 'entiteId' | 'detailsAvant' | 'detailsApres'> {}

class Historique extends Model<HistoriqueAttributes, HistoriqueCreationAttributes> implements HistoriqueAttributes {
  public id!: number;
  public utilisateurId?: number;
  public boutiqueId?: number;
  public typeAction!: TypeAction;
  public entite!: string;
  public entiteId?: number;
  public description!: string;
  public detailsAvant?: any;
  public detailsApres?: any;

  public readonly createdAt!: Date;
}

Historique.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    utilisateurId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'utilisateurs',
        key: 'id'
      }
    },
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'boutiques',
        key: 'id'
      }
    },
    typeAction: {
      type: DataTypes.ENUM(...Object.values(TypeAction)),
      allowNull: false
    },
    entite: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    entiteId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    detailsAvant: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    detailsApres: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'historiques',
    timestamps: true,
    updatedAt: false
  }
);

Historique.belongsTo(Utilisateur, { foreignKey: 'utilisateurId', as: 'utilisateur' });
Historique.belongsTo(Boutique, { foreignKey: 'boutiqueId', as: 'boutique' });

export default Historique;
