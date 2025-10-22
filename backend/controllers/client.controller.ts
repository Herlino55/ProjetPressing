import { Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Client, Boutique, Historique } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { getPagination, getPaginationData } from '../utils/helpers';
import { TypeAction } from '../models/historique.model';
import { RoleUtilisateur } from '../models/utilisateur.model';

export class ClientController {
  static async createClient(req: AuthRequest, res: Response): Promise<void> {
    try {

      let boutiqueId = req.user?.boutiqueId;

      if(!boutiqueId)
      {
        throw new NotFoundError('Boutique non trouvée');
      }

      const client = await Client.create({
        ...req.body,
        boutiqueId
      });

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.CREATE,
        boutiqueId: req.user?.boutiqueId,
        entite: 'Client',
        entiteId: client.id,
        description: `Création du client ${client.nom}`
      });

      res.status(201).json({
        success: true,
        message: 'Client créé avec succès',
        data: client
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du client',
        error: error.message
      });
    }
  }

  static async getClients(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { offset } = getPagination(page, limit);

      const whereClause: any = {};

        whereClause.boutiqueId = req.user?.boutiqueId;

      if(req.user?.role === RoleUtilisateur.ADMIN){
        const clients = await Client.findAndCountAll({
          include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const response = getPaginationData(clients, page, limit);

        res.json({
          success: true,
          data: response
        });
      }else{
        const clients = await Client.findAndCountAll({
          where: whereClause,
          include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
          limit,
          offset,
          order: [['createdAt', 'DESC']]
        });

        const response = getPaginationData(clients, page, limit);

        res.json({
          success: true,
          data: response
        });
      }

      
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des clients',
        error: error.message
      });
    }
  }

  static async getClientById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await Client.findByPk(req.params.id, {
        include: [{ model: Boutique, as: 'boutique' }]
      });

      if (!client) {
        throw new NotFoundError('Client non trouvé');
      }

      res.json({
        success: true,
        data: client
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateClient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        throw new NotFoundError('Client non trouvé');
      }

      const oldData = { ...client.toJSON() };

      await client.update(req.body);

      await Historique.create({
        utilisateurId: req.user?.id,
        boutiqueId: req.user?.boutiqueId,
        typeAction: TypeAction.UPDATE,
        entite: 'Client',
        entiteId: client.id,
        description: `Modification du client ${client.nom}`,
        detailsAvant: oldData,
        detailsApres: client.toJSON()
      });

      res.json({
        success: true,
        message: 'Client mis à jour avec succès',
        data: client
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteClient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await Client.findByPk(req.params.id);

      if (!client) {
        throw new NotFoundError('Client non trouvé');
      }

      const ClientData = {...client.toJSON()};

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.DELETE,
        boutiqueId: req.user?.boutiqueId,
        entite: 'Client',
        entiteId: client.id,
        description: `Suppression du client ${client.nom}`,
        detailsAvant: ClientData
      });

      await client.destroy();

      res.json({
        success: true,
        message: 'Client supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async searchClients(req: AuthRequest, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const boutiqueId = req.query.boutiqueId as string;

      if (!query) {
        res.status(400).json({
          success: false,
          message: 'Le terme de recherche est requis'
        });
        return;
      }

      const whereClause: any = {
        [Op.or]: [
          { nom: { [Op.iLike]: `%${query}%` } },
          { prenom: { [Op.iLike]: `%${query}%` } },
          { telephone: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } }
        ]
      };

      if (boutiqueId) {
        whereClause.boutiqueId = boutiqueId;
      }

      const clients = await Client.findAll({
        where: whereClause,
        include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
        limit: 20
      });

      res.json({
        success: true,
        data: clients
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche de clients',
        error: error.message
      });
    }
  }
}
