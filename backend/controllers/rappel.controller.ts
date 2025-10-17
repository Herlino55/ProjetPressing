import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Rappel, Boutique, Client, Commande } from "../models";
import { NotFoundError } from "../middlewares/error.middleware";
import { getPagination, getPaginationData } from "../utils/helpers";
import { generateWhatsAppLink } from "../services/whatsapp.service";

export class RappelController {
  // ✅ Créer un rappel et envoyer via WhatsApp
  static async createRappel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { type, clientId, commandeId, message } = req.body;

      // Vérifier la boutique de l’utilisateur connecté
      const boutiqueId = req.user?.boutiqueId;
      if (!boutiqueId) {
        res.status(400).json({
          success: false,
          message: "L'identifiant de la boutique est requis",
        });
        return;
      }

      // Vérifier si le client existe avant l’envoi
      const client = clientId ? await Client.findByPk(clientId) : null;
      if (clientId && !client) {
        res.status(404).json({
          success: false,
          message: "Client introuvable pour l’envoi du rappel",
        });
        return;
      }

      // Génération du lien WhatsApp
      let statut: "envoyé" | "échec" = "échec";
      let whatsappUrl: string | null = null;

      try {
        if (client && client.telephone) {
          whatsappUrl = generateWhatsAppLink(
            client.telephone,
            message,
            req.user?.nom || "la boutique"
          );
          statut = "envoyé";
        }
      } catch (error) {
        statut = "échec";
      }

      // Enregistrer le rappel dans la base de données
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

      // Retourner la réponse
      res.status(201).json({
        success: true,
        message: "Rappel créé avec succès",
        data: {
          rappel,
          whatsappUrl, // le lien que le front peut ouvrir directement
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la création du rappel",
        error: error.message,
      });
    }
  }

  // ✅ Récupérer tous les rappels (avec pagination et filtres)
  static async getRappels(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const whereClause: any = {};

      if (req.query.boutiqueId) whereClause.boutiqueId = req.query.boutiqueId;
      if (req.query.type) whereClause.type = req.query.type;
      if (req.query.statut) whereClause.statut = req.query.statut;

      const rappels = await Rappel.findAndCountAll({
        where: whereClause,
        include: [
          { model: Boutique, as: "boutique", attributes: ["id", "nom"] },
          { model: Client, as: "client", attributes: ["id", "nom", "telephone"] },
          { model: Commande, as: "commande", attributes: ["id", "numeroCommande"] },
        ],
        limit,
        offset,
        order: [["dateEnvoi", "DESC"]],
      });

      const response = getPaginationData(rappels, page, limit);

      res.json({
        success: true,
        data: response,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération des rappels",
        error: error.message,
      });
    }
  }

  static async getAllRappelsByBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const boutiqueId = req.params.boutiqueId;
        const rappels = await Rappel.findAll({
            where: { boutiqueId },
            include: [
                { model: Boutique, as: "boutique", attributes: ["nom"] },
                { model: Client, as: "client", attributes: ["nom", "telephone"] },
                { model: Commande, as: "commande", attributes: ["numeroCommande"] },
            ],
            order: [["dateEnvoi", "DESC"]],
        });

        res.json({
            success: true,
            data: rappels,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des rappels par boutique",
            error: error.message,
        });
    }
    }

    static async getAllRappelsByClient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const clientId = req.params.clientId;
        const rappels = await Rappel.findAll({
            where: { clientId },
            include: [
                { model: Boutique, as: "boutique", attributes: ["nom"] },
                { model: Client, as: "client", attributes: ["nom", "telephone"] },
                { model: Commande, as: "commande", attributes: ["numeroCommande"] },
            ],
            order: [["dateEnvoi", "DESC"]],
        });

        res.json({
            success: true,
            data: rappels,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des rappels par boutique",
            error: error.message,
        });
    }
    }

  // ✅ Récupérer un rappel par ID
  static async getRappelById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const rappel = await Rappel.findByPk(req.params.id, {
        include: [
          { model: Boutique, as: "boutique" },
          { model: Client, as: "client" },
          { model: Commande, as: "commande" },
        ],
      });

      if (!rappel) throw new NotFoundError("Rappel non trouvé");

      res.json({
        success: true,
        data: rappel,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ Supprimer un rappel
  static async deleteRappel(req: AuthRequest, res: Response): Promise<void> {
    try {
      const rappel = await Rappel.findByPk(req.params.id);

      if (!rappel) throw new NotFoundError("Rappel non trouvé");

      await rappel.destroy();

      res.json({
        success: true,
        message: "Rappel supprimé avec succès",
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
