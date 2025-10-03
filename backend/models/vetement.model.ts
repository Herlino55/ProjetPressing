import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db.config';

interface VetementAttributes {
  id: number;
  nom: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VetementCreationAttributes extends Optional<VetementAttributes, 'id' | 'description' | 'image'> {}

class Vetement extends Model<VetementAttributes, VetementCreationAttributes> implements VetementAttributes {
  public id!: number;
  public nom!: string;
  public description?: string;
  public image?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Vetement.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'vetements',
    timestamps: true
  }
);

export default Vetement;
