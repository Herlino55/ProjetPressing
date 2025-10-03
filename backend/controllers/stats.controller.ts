import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { StatsService } from '../services/stats.service';

export class StatsController {
  static async getGlobalStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await StatsService.getGlobalStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  static async getStatsByBoutique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { boutiqueId } = req.params;
      const stats = await StatsService.getGlobalStats(parseInt(boutiqueId));

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  static async getStatsByPeriod(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const boutiqueId = req.query.boutiqueId as string;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          message: 'Les dates de début et de fin sont requises'
        });
        return;
      }

      const stats = await StatsService.getStatsByPeriod(
        new Date(startDate as string),
        new Date(endDate as string),
        boutiqueId ? parseInt(boutiqueId) : undefined
      );

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques',
        error: error.message
      });
    }
  }

  static async getTopClients(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const boutiqueId = req.query.boutiqueId as string;

      const topClients = await StatsService.calculateTopClients(
        limit,
        boutiqueId ? parseInt(boutiqueId) : undefined
      );

      res.json({
        success: true,
        data: topClients
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des meilleurs clients',
        error: error.message
      });
    }
  }

  static async getTopVetements(req: AuthRequest, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const boutiqueId = req.query.boutiqueId as string;

      const topVetements = await StatsService.calculateTopVetements(
        limit,
        boutiqueId ? parseInt(boutiqueId) : undefined
      );

      res.json({
        success: true,
        data: topVetements
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des vêtements les plus traités',
        error: error.message
      });
    }
  }
}
