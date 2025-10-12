import cron from "node-cron";
import { RappelService } from "./rappel.service";
import { Commande, Client, Boutique } from "../models";

/**
 * Service de planification automatique des rappels
 */
export class SchedulerService {
  /**
   * Démarre toutes les tâches planifiées (cron jobs)
   */
  static startJobs() {
    console.log("⏳ Initialisation des rappels automatiques...");

    // 🔔 1. Relancer les clients dont la commande est prête mais non retirée
    cron.schedule("0 9 * * *", async () => {
      console.log("🕘 Vérification des commandes prêtes non retirées...");
      await this.sendNonRetraitReminders();
    });

    // 🔔 2. Message de fidélisation chaque lundi à 10h
    cron.schedule("0 10 * * 1", async () => {
      console.log("💚 Envoi des rappels de fidélisation...");
      await this.sendFidelisationReminders();
    });
  }

  /**
   * Envoie un rappel aux clients dont les commandes prêtes n'ont pas été retirées depuis 2 jours
   */
  private static async sendNonRetraitReminders() {
    const deuxJours = new Date();
    deuxJours.setDate(deuxJours.getDate() - 2);

    const commandes = await Commande.findAll({
      where: {
        statut: "prête",
        updatedAt: { $lte: deuxJours },
      },
      include: [{ model: Client, attributes: ['nom', 'telephone']}, { model: Boutique, attributes: ['nom'] }],
    });

    for (const cmd of commandes) {
      if (cmd.Client?.telephone) {
        const message = `Bonjour ${cmd.Client.nom}, votre commande est prête depuis 2 jours. Merci de passer la récupérer.`;
        await RappelService.createRappel({
          type: "non_retrait",
          boutiqueId: cmd.boutiqueId,
          clientId: cmd.clientId,
          commandeId: cmd.id,
          message,
          senderName: cmd.Boutique?.nom || "Votre pressing",
        });
      }
    }
  }

  /**
   * Envoie un message de fidélisation aux clients réguliers
   */
  private static async sendFidelisationReminders() {
    const clients = await Client.findAll({
      include: [{ model: Boutique, as: "boutique" }],
    });

    for (const client of clients) {
      const message = `Bonjour ${client.nom}, merci pour votre fidélité ! Un nettoyage gratuit vous attend après 10 commandes 🧺✨`;
      await RappelService.createRappel({
        type: "fidelisation",
        boutiqueId: client.boutiqueId,
        clientId: client.id,
        message,
        senderName: client.Boutique?.nom || "Votre pressing",
      });
    }
  }
}
