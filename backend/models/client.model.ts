import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';
import Boutique from './boutique.model';

interface ClientAttributes {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  boutiqueId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'email' | 'adresse'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public nom!: string;
  public prenom!: string;
  public telephone!: string;
  public email?: string;
  public adresse?: string;
  public boutiqueId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
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
    adresse: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'boutiques',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'clients',
    timestamps: true
  }
);

Client.belongsTo(Boutique, { foreignKey: 'boutiqueId', as: 'boutique' });
Boutique.hasMany(Client, { foreignKey: 'boutiqueId', as: 'clients' });

export default Client;
