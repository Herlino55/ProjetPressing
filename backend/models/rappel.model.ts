import { DataTypes, Model, Optional } from "sequelize";
import  sequelize  from "../config/db.config";
import Boutique from "./boutique.model";
import Client from "./client.model";
import Commande from "./commande.model";

// Définition de l'interface TypeScript pour les attributs du modèle
interface RappelAttributes {
  id?: number;
  type:
    | "commande_prete"
    | "non_retrait"
    | "fidelisation"
    | "paiement"
    | "alerte_rendement";
  boutiqueId: number;
  clientId?: number;
  commandeId?: number;
  statut: "envoyé" | "échec";
  canal: "whatsapp";
  message: string;
  dateEnvoi: Date;
}

// Permet de gérer les champs optionnels lors de la création
interface RappelCreationAttributes extends Optional<RappelAttributes, "id" | "clientId" | "commandeId"> {}

// Définition du modèle Sequelize
class Rappel
  extends Model<RappelAttributes, RappelCreationAttributes>
  implements RappelAttributes
{
  public id!: number;
  public type!:
    | "commande_prete"
    | "non_retrait"
    | "fidelisation"
    | "paiement"
    | "alerte_rendement";
  public boutiqueId!: number;
  public clientId?: number;
  public commandeId?: number;
  public statut!: "envoyé" | "échec";
  public canal!: "whatsapp";
  public message!: string;
  public dateEnvoi!: Date;

  // timestamps automatiques (createdAt, updatedAt)
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialisation du modèle
Rappel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(
        "commande_prete",
        "non_retrait",
        "fidelisation",
        "paiement",
        "alerte_rendement"
      ),
      allowNull: false,
    },
    boutiqueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Boutiques", key: "id" },
      onDelete: "CASCADE",
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Clients", key: "id" },
      onDelete: "SET NULL",
    },
    commandeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Commandes", key: "id" },
      onDelete: "SET NULL",
    },
    statut: {
      type: DataTypes.ENUM("envoyé", "échec"),
      allowNull: false,
      defaultValue: "envoyé",
    },
    canal: {
      type: DataTypes.ENUM("whatsapp"),
      allowNull: false,
      defaultValue: "whatsapp",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Rappels",
    modelName: "Rappel",
    timestamps: true,
  }
);

Rappel.belongsTo(Boutique, { foreignKey: "boutiqueId" });
Rappel.belongsTo(Client, { foreignKey: "clientId" });
Rappel.belongsTo(Commande, { foreignKey: "commandeId" });
Boutique.hasMany(Rappel, { foreignKey: "boutiqueId" });
Client.hasMany(Rappel, { foreignKey: "clientId" });
Commande.hasMany(Rappel, { foreignKey: "commandeId" });

export default Rappel;
