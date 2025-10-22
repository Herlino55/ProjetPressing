import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Boutique, Historique } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { CloudinaryService } from '../services/cloudinary.service';
import { TypeAction } from '../models/historique.model';

export class BoutiqueController {
  static async createBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      let logoUrl = null;

      if (req.file) {
        const result = await CloudinaryService.uploadImage(req.file.buffer, 'boutiques');
        logoUrl = result.secure_url;
      }

      const boutique = await Boutique.create({
        ...req.body,
        logo: logoUrl
      });

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.CREATE,
        boutiqueId: boutique.id,
        entite: 'boutique',
        entiteId: boutique.id,
        description: `Création de la boutique ${boutique.nom}`
      });

      res.status(201).json({
        success: true,
        message: 'Boutique créée avec succès',
        data: boutique
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la boutique',
        error: error.message
      });
    }
  }

  static async getBoutiques(req: AuthRequest, res: Response): Promise<void> {
    try {
      const boutiques = await Boutique.findAll({
        where: req.query.actif !== undefined ? { actif: req.query.actif === 'true' } : {},
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: boutiques
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des boutiques',
        error: error.message
      });
    }
  }

  static async getBoutiqueById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const boutique = await Boutique.findByPk(req.params.id);

      if (!boutique) {
        throw new NotFoundError('Boutique non trouvée');
      }

      res.json({
        success: true,
        data: boutique
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const boutique = await Boutique.findByPk(req.params.id);

      if (!boutique) {
        throw new NotFoundError('Boutique non trouvée');
      }

      const oldData = { ...boutique.toJSON() };
      if (req.file) {
        if (boutique.logo) {
          const publicId = CloudinaryService.extractPublicId(boutique.logo);
          await CloudinaryService.deleteImage(publicId);
        }

        const result = await CloudinaryService.uploadImage(req.file.buffer, 'boutiques');
        req.body.logo = result.secure_url;
      }
      

      await boutique.update(req.body);

      await Historique.create({
        utilisateurId: req.user?.id,
        boutiqueId: boutique.id,
        typeAction: TypeAction.UPDATE,
        entite: 'boutique',
        entiteId: boutique.id,
        description: `Modification de la boutique ${boutique.nom}`,
        detailsAvant: oldData,
        detailsApres: boutique.toJSON()
      });

      res.json({
        success: true,
        message: 'Boutique mise à jour avec succès',
        data: boutique
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const boutique = await Boutique.findByPk(req.params.id);

      if (!boutique) {
        throw new NotFoundError('Boutique non trouvée');
      }

      const boutiqueData = { ...boutique.toJSON() };

      boutique.actif = false;

      await boutique.save();

      // await boutique.destroy();

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.UPDATE,
        boutiqueId: boutique.id,
        entite: 'boutique',
        entiteId: boutique.id,
        description: `Suppression de la boutique ${boutique.nom}`,
        detailsAvant: boutiqueData
      });

      res.json({
        success: true,
        message: 'Boutique supprimée avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getBoutiqueHistorique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const historique = await Historique.findAll({
        where: { boutiqueId: req.params.id },
        include: [{ model: require('../models/utilisateur.model').default, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: historique
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
