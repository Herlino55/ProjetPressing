import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Commande, Client, Boutique, Utilisateur, CommandeDetail, Vetement, Tarif, Historique } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { generateNumeroCommande, getPagination, getPaginationData } from '../utils/helpers';
import { TypeAction } from '../models/historique.model';
import { RoleUtilisateur } from '../models/utilisateur.model';

export class CommandeController {
  static async createCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const numeroCommande = generateNumeroCommande();
      let montantTotal = 0;
      const commande = await Commande.create({
        ...req.body,
        numeroCommande,
        montantTotal,
        boutiqueId: req.user?.boutiqueId,
        utilisateurId: req.user?.id
      });

      const commandeWithRelations = await Commande.findByPk(commande.id, {
        include: [
          { model: Client, as: 'client' },
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
        ]
      });

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.CREATE,
        boutiqueId: commande.boutiqueId,
        entite: 'Commande',
        entiteId: commande.id,
        description: `Création de la commande ${commande.numeroCommande}`
      });


      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: commandeWithRelations
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la commande',
        error: error.message
      });
    }
  }

  static async getCommandes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const whereClause: any = {};

      if (req.user?.boutiqueId) {
        whereClause.boutiqueId = req.user?.boutiqueId;
      }

      if (req.query.clientId) {
        whereClause.clientId = req.query.clientId;
      }

      if (req.query.statut) {
        whereClause.statut = req.query.statut;
      }

      if(req.user?.role === RoleUtilisateur.ADMIN)
      {
        const commandes = await Commande.findAndCountAll({
          include: [
            { model: Client, as: 'client' },
            { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] },
            { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
          ],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const response = getPaginationData(commandes, page, limit);

        res.json({
          success: true,
          data: response
        });
      }else
      {
        const commandes = await Commande.findAndCountAll({
          where: whereClause,
          include: [
            { model: Client, as: 'client' },
            { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] },
            { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
          ],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const response = getPaginationData(commandes, page, limit);

        res.json({
          success: true,
          data: response
        });
      }

      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes',
        error: error.message
      });
    }
  }

  static async getCommandeById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const commande = await Commande.findByPk(req.params.id, {
        include: [
          { model: Client, as: 'client' },
          { model: Boutique, as: 'boutique' },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] },
          {
            model: CommandeDetail,
            as: 'details',
            include: [
              { model: Vetement, as: 'vetement' },
              { model: Tarif, as: 'tarif' }
            ]
          }
        ]
      });

      if (!commande) {
        throw new NotFoundError('Commande non trouvée');
      }

      res.json({
        success: true,
        data: commande
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const commande = await Commande.findByPk(req.params.id);

      if (!commande) {
        throw new NotFoundError('Commande non trouvée');
      }

      const oldData = { ...commande.toJSON() }

      await commande.update(req.body);

      const updatedCommande = await Commande.findByPk(commande.id, {
        include: [
          { model: Client, as: 'client' },
          { model: Boutique, as: 'boutique' },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
        ]
      });

      await Historique.create({
        utilisateurId: req.user?.id,
        boutiqueId: commande.boutiqueId,
        typeAction: TypeAction.UPDATE,
        entite: 'commande',
        entiteId: commande.id,
        description: `Modification de la commande ${commande.numeroCommande}`,
        detailsAvant: oldData,
        detailsApres: commande.toJSON()
      });

      res.json({
        success: true,
        message: 'Commande mise à jour avec succès',
        data: updatedCommande
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteCommande(req: AuthRequest, res: Response): Promise<void> {
    try {
      const commande = await Commande.findByPk(req.params.id);

      if (!commande) {
        throw new NotFoundError('Commande non trouvée');
      }

      const commandeData = { ...commande.toJSON() };

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.DELETE,
        boutiqueId: commande.boutiqueId,
        entite: 'commande',
        entiteId: commande.id,
        description: `Suppression de la commande ${commande.numeroCommande}`,
        detailsAvant: commandeData
      });

      await commande.destroy();

      res.json({
        success: true,
        message: 'Commande supprimée avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getCommandesByClient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const commandes = await Commande.findAll({
        where: { clientId: req.params.clientId },
        include: [
          { model: Boutique, as: 'boutique', attributes: ['id', 'nom'] },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: commandes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes',
        error: error.message
      });
    }
  }

  static async getCommandesByBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const commandes = await Commande.findAndCountAll({
        where: { boutiqueId: req.user?.boutiqueId },
        include: [
          { model: Client, as: 'client' },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      });

      const response = getPaginationData(commandes, page, limit);

      res.json({
        success: true,
        data: response
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des commandes',
        error: error.message
      });
    }
  }

  static async updateCommandeStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const commande = await Commande.findByPk(req.params.id);

      if (!commande) {
        throw new NotFoundError('Commande non trouvée');
      }

      const oldData = { ...commande.toJSON() }

      await commande.update({ statut: req.body.statut });

      const updatedCommande = await Commande.findByPk(commande.id, {
        include: [
          { model: Client, as: 'client' },
          { model: Boutique, as: 'boutique' },
          { model: Utilisateur, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }
        ]
      });

      await Historique.create({
        utilisateurId: req.user?.id,
        boutiqueId: commande.boutiqueId,
        typeAction: TypeAction.UPDATE,
        entite: 'commande',
        entiteId: commande.id,
        description: `mise a jour du statut de la commande ${commande.numeroCommande}`,
        detailsAvant: oldData,
        detailsApres: commande.toJSON()
      });

      res.json({
        success: true,
        message: 'Statut de la commande mis à jour avec succès',
        data: updatedCommande
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
