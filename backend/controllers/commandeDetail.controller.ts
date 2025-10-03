import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CommandeDetail, Commande, Vetement, Tarif } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';

export class CommandeDetailController {
  static async addDetailToCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { commandeId } = req.params;
      const { vetementId, tarifId, quantite, prixUnitaire, notes } = req.body;

      const commande = await Commande.findByPk(commandeId);
      if (!commande) {
        throw new NotFoundError('Commande non trouvée');
      }

      const sousTotal = quantite * prixUnitaire;

      const detail = await CommandeDetail.create({
        commandeId: parseInt(commandeId),
        vetementId,
        tarifId,
        quantite,
        prixUnitaire,
        sousTotal,
        notes
      });

      const details = await CommandeDetail.findAll({
        where: { commandeId },
        attributes: ['sousTotal']
      });

      const montantTotal = details.reduce((sum, d) => sum + parseFloat(d.sousTotal.toString()), 0);
      await commande.update({ montantTotal });

      const detailWithRelations = await CommandeDetail.findByPk(detail.id, {
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Tarif, as: 'tarif' }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Article ajouté à la commande avec succès',
        data: detailWithRelations
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getDetailsByCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { commandeId } = req.params;

      const details = await CommandeDetail.findAll({
        where: { commandeId },
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Tarif, as: 'tarif' }
        ]
      });

      res.json({
        success: true,
        data: details
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des détails',
        error: error.message
      });
    }
  }

  static async updateDetail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const detail = await CommandeDetail.findByPk(req.params.detailId);

      if (!detail) {
        throw new NotFoundError('Détail de commande non trouvé');
      }

      const { quantite, prixUnitaire, notes } = req.body;

      const updateData: any = {};
      if (quantite !== undefined) updateData.quantite = quantite;
      if (prixUnitaire !== undefined) updateData.prixUnitaire = prixUnitaire;
      if (notes !== undefined) updateData.notes = notes;

      if (quantite !== undefined || prixUnitaire !== undefined) {
        const newQuantite = quantite !== undefined ? quantite : detail.quantite;
        const newPrix = prixUnitaire !== undefined ? prixUnitaire : detail.prixUnitaire;
        updateData.sousTotal = newQuantite * newPrix;
      }

      await detail.update(updateData);

      const details = await CommandeDetail.findAll({
        where: { commandeId: detail.commandeId },
        attributes: ['sousTotal']
      });

      const montantTotal = details.reduce((sum, d) => sum + parseFloat(d.sousTotal.toString()), 0);
      await Commande.update({ montantTotal }, { where: { id: detail.commandeId } });

      const updatedDetail = await CommandeDetail.findByPk(detail.id, {
        include: [
          { model: Vetement, as: 'vetement' },
          { model: Tarif, as: 'tarif' }
        ]
      });

      res.json({
        success: true,
        message: 'Détail mis à jour avec succès',
        data: updatedDetail
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async removeDetail(req: AuthRequest, res: Response): Promise<void> {
    try {
      const detail = await CommandeDetail.findByPk(req.params.detailId);

      if (!detail) {
        throw new NotFoundError('Détail de commande non trouvé');
      }

      const commandeId = detail.commandeId;
      await detail.destroy();

      const details = await CommandeDetail.findAll({
        where: { commandeId },
        attributes: ['sousTotal']
      });

      const montantTotal = details.reduce((sum, d) => sum + parseFloat(d.sousTotal.toString()), 0);
      await Commande.update({ montantTotal }, { where: { id: commandeId } });

      res.json({
        success: true,
        message: 'Détail supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
