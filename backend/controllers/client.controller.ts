import { Response } from 'express';
import { Op } from 'sequelize';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Client, Boutique } from '../models';
import { NotFoundError } from '../middlewares/error.middleware';
import { getPagination, getPaginationData } from '../utils/helpers';

export class ClientController {
  static async createClient(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await Client.create(req.body);

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

      if (req.query.boutiqueId) {
        whereClause.boutiqueId = req.query.boutiqueId;
      }

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

      await client.update(req.body);

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
