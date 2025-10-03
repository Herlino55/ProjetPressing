import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Vetement } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { CloudinaryService } from '../services/cloudinary.service';

export class VetementController {
  static async createVetement(req: AuthRequest, res: Response): Promise<void> {
    try {
      let imageUrl = null;

      if (req.file) {
        const result = await CloudinaryService.uploadImage(req.file.buffer, 'vetements');
        imageUrl = result.secure_url;
      }

      const vetement = await Vetement.create({
        ...req.body,
        image: imageUrl
      });

      res.status(201).json({
        success: true,
        message: 'Vêtement créé avec succès',
        data: vetement
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du vêtement',
        error: error.message
      });
    }
  }

  static async getVetements(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vetements = await Vetement.findAll({
        order: [['nom', 'ASC']]
      });

      res.json({
        success: true,
        data: vetements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des vêtements',
        error: error.message
      });
    }
  }

  static async getVetementById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vetement = await Vetement.findByPk(req.params.id);

      if (!vetement) {
        throw new NotFoundError('Vêtement non trouvé');
      }

      res.json({
        success: true,
        data: vetement
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateVetement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vetement = await Vetement.findByPk(req.params.id);

      if (!vetement) {
        throw new NotFoundError('Vêtement non trouvé');
      }

      if (req.file) {
        if (vetement.image) {
          const publicId = CloudinaryService.extractPublicId(vetement.image);
          await CloudinaryService.deleteImage(publicId);
        }

        const result = await CloudinaryService.uploadImage(req.file.buffer, 'vetements');
        req.body.image = result.secure_url;
      }

      await vetement.update(req.body);

      res.json({
        success: true,
        message: 'Vêtement mis à jour avec succès',
        data: vetement
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteVetement(req: AuthRequest, res: Response): Promise<void> {
    try {
      const vetement = await Vetement.findByPk(req.params.id);

      if (!vetement) {
        throw new NotFoundError('Vêtement non trouvé');
      }

      if (vetement.image) {
        const publicId = CloudinaryService.extractPublicId(vetement.image);
        await CloudinaryService.deleteImage(publicId);
      }

      await vetement.destroy();

      res.json({
        success: true,
        message: 'Vêtement supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
