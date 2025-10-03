import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface BoutiqueAttributes {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email?: string;
  logo?: string;
  actif: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BoutiqueCreationAttributes extends Optional<BoutiqueAttributes, 'id' | 'email' | 'logo' | 'actif'> {}

class Boutique extends Model<BoutiqueAttributes, BoutiqueCreationAttributes> implements BoutiqueAttributes {
  public id!: number;
  public nom!: string;
  public adresse!: string;
  public telephone!: string;
  public email?: string;
  public logo?: string;
  public actif!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Boutique.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telephone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    logo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: 'boutiques',
    timestamps: true
  }
);

export default Boutique;
