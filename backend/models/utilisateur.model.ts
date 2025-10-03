import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Boutique from './boutique.model';

export enum RoleUtilisateur {
  ADMIN = 'admin',
  GERANT = 'gerant',
  EMPLOYE = 'employe'
}

interface UtilisateurAttributes {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  role: RoleUtilisateur;
  boutiqueId?: number;
  actif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UtilisateurCreationAttributes extends Optional<UtilisateurAttributes, 'id' | 'telephone' | 'boutiqueId' | 'actif'> {}

class Utilisateur extends Model<UtilisateurAttributes, UtilisateurCreationAttributes> implements UtilisateurAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public email!: string;
  public password!: string;
  public telephone?: string;
  public role!: RoleUtilisateur;
  public boutiqueId?: number;
  public actif!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Utilisateur.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM(...Object.values(RoleUtilisateur)),
      allowNull: false,
      defaultValue: RoleUtilisateur.EMPLOYE
    },
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'boutiques',
        key: 'id'
      }
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'utilisateurs',
    timestamps: true
  }
);

Utilisateur.belongsTo(Boutique, { foreignKey: 'boutiqueId', as: 'boutique' });
Boutique.hasMany(Utilisateur, { foreignKey: 'boutiqueId', as: 'utilisateurs' });

export default Utilisateur;
