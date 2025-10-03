import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Tarif, Vetement, Boutique } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';

export class TarifController {
  static async createTarif(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tarif = await Tarif.create(req.body);

      const tarifWithRelations = await Tarif.findByPk(tarif.id, {
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Tarif créé avec succès',
        data: tarifWithRelations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du tarif',
        error: error.message
      });
    }
  }

  static async getTarifs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const whereClause: any = {};

      if (req.query.boutiqueId) {
        whereClause.boutiqueId = req.query.boutiqueId;
      }

      if (req.query.vetementId) {
        whereClause.vetementId = req.query.vetementId;
      }

      if (req.query.typeService) {
        whereClause.typeService = req.query.typeService;
      }

      if (req.query.actif !== undefined) {
        whereClause.actif = req.query.actif === 'true';
      }

      const tarifs = await Tarif.findAll({
        where: whereClause,
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: tarifs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des tarifs',
        error: error.message
      });
    }
  }

  static async getTarifById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tarif = await Tarif.findByPk(req.params.id, {
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Boutique, as: 'boutique' }
        ]
      });

      if (!tarif) {
        throw new NotFoundError('Tarif non trouvé');
      }

      res.json({
        success: true,
        data: tarif
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateTarif(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tarif = await Tarif.findByPk(req.params.id);

      if (!tarif) {
        throw new NotFoundError('Tarif non trouvé');
      }

      await tarif.update(req.body);

      const updatedTarif = await Tarif.findByPk(tarif.id, {
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Boutique, as: 'boutique' }
        ]
      });

      res.json({
        success: true,
        message: 'Tarif mis à jour avec succès',
        data: updatedTarif
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteTarif(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tarif = await Tarif.findByPk(req.params.id);

      if (!tarif) {
        throw new NotFoundError('Tarif non trouvé');
      }

      await tarif.destroy();

      res.json({
        success: true,
        message: 'Tarif supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTarifByVetement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { vetementId } = req.params;
      const { boutiqueId, typeService } = req.query;

      const whereClause: any = { vetementId };

      if (boutiqueId) {
        whereClause.boutiqueId = boutiqueId;
      }

      if (typeService) {
        whereClause.typeService = typeService;
      }

      whereClause.actif = true;

      const tarifs = await Tarif.findAll({
        where: whereClause,
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }
        ]
      });

      res.json({
        success: true,
        data: tarifs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des tarifs',
        error: error.message
      });
    }
  }
}
