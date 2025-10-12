import { Rappel, Client } from "../models";
import { generateWhatsAppLink } from "./whatsapp.service";

/**
 * Service pour la gestion des rappels.
 */
export class RappelService {
  /**
   * Crée un nouveau rappel et retourne le lien WhatsApp prêt à être ouvert.
   */
  static async createRappel({
    type,
    boutiqueId,
    clientId,
    commandeId,
    message,
    senderName,
  }: {
    type:
      | "commande_prete"
      | "non_retrait"
      | "fidelisation"
      | "paiement"
      | "alerte_rendement";
    boutiqueId: number;
    clientId?: number;
    commandeId?: number;
    message: string;
    senderName?: string;
  }) {
    let statut: "envoyé" | "échec" = "échec";
    let whatsappUrl: string | null = null;

    const client = clientId ? await Client.findByPk(clientId) : null;

    if (client && client.telephone) {
      try {
        whatsappUrl = generateWhatsAppLink(
          client.telephone,
          message,
          senderName || "la boutique"
        );
        statut = "envoyé";
      } catch {
        statut = "échec";
      }
    }

    const rappel = await Rappel.create({
      type,
      boutiqueId,
      clientId,
      commandeId,
      statut,
      canal: "whatsapp",
      message,
      dateEnvoi: new Date(),
    });

    return { rappel, whatsappUrl };
  }

  /**
   * Récupère tous les rappels d’une boutique donnée.
   */
  static async getRappelsByBoutique(boutiqueId: number) {
    return Rappel.findAll({
      where: { boutiqueId },
      order: [["dateEnvoi", "DESC"]],
    });
  }
}
