import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Historique, Utilisateur, Boutique } from '../models';
import { getPagination, getPaginationData } from '../utils/helpers';

export class HistoriqueController {
  static async getHistoriqueGlobal(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { offset } = getPagination(page, limit);

      const whereClause: any = {};

      if (req.query.typeAction) {
        whereClause.typeAction = req.query.typeAction;
      }

      if (req.query.entite) {
        whereClause.entite = req.query.entite;
      }

      const historique = await Historique.findAndCountAll({
        where: whereClause,
        include: [
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom', 'email'] },
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const response = getPaginationData(historique, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  }

  static async getHistoriqueByBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { offset } = getPagination(page, limit);

      const historique = await Historique.findAndCountAll({
        where: { boutiqueId: req.params.boutiqueId },
        include: [
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom', 'email'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const response = getPaginationData(historique, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  }

  static async getHistoriqueByUtilisateur(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { offset } = getPagination(page, limit);

      const historique = await Historique.findAndCountAll({
        where: { utilisateurId: req.params.userId },
        include: [
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const response = getPaginationData(historique, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  }
}
