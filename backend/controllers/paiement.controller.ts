import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Paiement, Commande, Client } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { getPagination, getPaginationData } from '../utils/helpers';

export class PaiementController {
  static async createPaiement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paiement = await Paiement.create(req.body);

      const paiementWithRelations = await Paiement.findByPk(paiement.id, {
        include: [{
          model: Commande,
          as: 'commande',
          include: [{ model: Client, as: 'client' }]
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Paiement enregistré avec succès',
        data: paiementWithRelations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du paiement',
        error: error.message
      });
    }
  }

  static async getPaiements(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const whereClause: any = {};

      if (req.query.statut) {
        whereClause.statut = req.query.statut;
      }

      if (req.query.methodePaiement) {
        whereClause.methodePaiement = req.query.methodePaiement;
      }

      const paiements = await Paiement.findAndCountAll({
        where: whereClause,
        include: [{
          model: Commande,
          as: 'commande',
          include: [{ model: Client, as: 'client' }]
        }],
        limit,
        offset,
        order: [['datePaiement', 'DESC']]
      });

      const response = getPaginationData(paiements, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des paiements',
        error: error.message
      });
    }
  }

  static async getPaiementById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paiement = await Paiement.findByPk(req.params.id, {
        include: [{
          model: Commande,
          as: 'commande',
          include: [{ model: Client, as: 'client' }]
        }]
      });

      if (!paiement) {
        throw new NotFoundError('Paiement non trouvé');
      }

      res.json({
        success: true,
        data: paiement
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updatePaiement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paiement = await Paiement.findByPk(req.params.id);

      if (!paiement) {
        throw new NotFoundError('Paiement non trouvé');
      }

      await paiement.update(req.body);

      const updatedPaiement = await Paiement.findByPk(paiement.id, {
        include: [{
          model: Commande,
          as: 'commande',
          include: [{ model: Client, as: 'client' }]
        }]
      });

      res.json({
        success: true,
        message: 'Paiement mis à jour avec succès',
        data: updatedPaiement
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deletePaiement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paiement = await Paiement.findByPk(req.params.id);

      if (!paiement) {
        throw new NotFoundError('Paiement non trouvé');
      }

      await paiement.destroy();

      res.json({
        success: true,
        message: 'Paiement supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getPaiementsByCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const paiements = await Paiement.findAll({
        where: { commandeId: req.params.commandeId },
        order: [['datePaiement', 'DESC']]
      });

      res.json({
        success: true,
        data: paiements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des paiements',
        error: error.message
      });
    }
  }

  static async getPaiementsByBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const paiements = await Paiement.findAndCountAll({
        include: [{
          model: Commande,
          as: 'commande',
          where: { boutiqueId: req.params.boutiqueId },
          include: [{ model: Client, as: 'client' }]
        }],
        limit,
        offset,
        order: [['datePaiement', 'DESC']]
      });

      const response = getPaginationData(paiements, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des paiements',
        error: error.message
      });
    }
  }
}
