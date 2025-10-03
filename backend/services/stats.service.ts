import { Op } from 'sequelize';
import sequelize from '../config/db.config';
import { Commande, Paiement, Client, CommandeDetail, Vetement } from '../models';
import { StatutCommande } from '../models/commande.model';
import { StatutPaiement } from '../models/paiement.model';

interface PeriodFilter {
  startDate?: Date;
  endDate?: Date;
}

export class StatsService {
  static async calculateCA(boutiqueId?: number, period?: PeriodFilter): Promise<number> {
    const whereClause: any = {
      statut: StatutPaiement.PAYE
    };

    if (period?.startDate || period?.endDate) {
      whereClause.datePaiement = {};
      if (period.startDate) whereClause.datePaiement[Op.gte] = period.startDate;
      if (period.endDate) whereClause.datePaiement[Op.lte] = period.endDate;
    }

    const result = await Paiement.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('montant')), 'total']],
      where: whereClause,
      ...(boutiqueId && {
        include: [{
          model: Commande,
          as: 'commande',
          where: { boutiqueId },
          attributes: []
        }]
      }),
      raw: true
    }) as any;

    return parseFloat(result?.total || '0');
  }

  static async calculateOrdersStats(boutiqueId?: number, period?: PeriodFilter) {
    const whereClause: any = {};

    if (boutiqueId) {
      whereClause.boutiqueId = boutiqueId;
    }

    if (period?.startDate || period?.endDate) {
      whereClause.createdAt = {};
      if (period.startDate) whereClause.createdAt[Op.gte] = period.startDate;
      if (period.endDate) whereClause.createdAt[Op.lte] = period.endDate;
    }

    const totalCommandes = await Commande.count({ where: whereClause });

    const commandesParStatut = await Commande.findAll({
      attributes: [
        'statut',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: whereClause,
      group: ['statut'],
      raw: true
    }) as any[];

    return {
      totalCommandes,
      commandesParStatut: commandesParStatut.reduce((acc: any, curr: any) => {
        acc[curr.statut] = parseInt(curr.count);
        return acc;
      }, {})
    };
  }

  static async calculateTopClients(limit: number = 10, boutiqueId?: number) {
    const whereClause: any = {};
    if (boutiqueId) whereClause.boutiqueId = boutiqueId;

    const topClients = await Commande.findAll({
      attributes: [
        'clientId',
        [sequelize.fn('COUNT', sequelize.col('Commande.id')), 'nbCommandes'],
        [sequelize.fn('SUM', sequelize.col('montantTotal')), 'montantTotal']
      ],
      where: whereClause,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'nom', 'prenom', 'telephone', 'email']
      }],
      group: ['clientId', 'client.id'],
      order: [[sequelize.literal('montantTotal'), 'DESC']],
      limit,
      raw: false
    });

    return topClients;
  }

  static async calculateTopVetements(limit: number = 10, boutiqueId?: number) {
    const whereClause: any = {};

    const topVetements = await CommandeDetail.findAll({
      attributes: [
        'vetementId',
        [sequelize.fn('SUM', sequelize.col('quantite')), 'totalQuantite'],
        [sequelize.fn('COUNT', sequelize.col('CommandeDetail.id')), 'nbCommandes']
      ],
      include: [
        {
          model: Vetement,
          as: 'vetement',
          attributes: ['id', 'nom', 'description', 'image']
        },
        ...(boutiqueId ? [{
          model: Commande,
          as: 'commande',
          where: { boutiqueId },
          attributes: []
        }] : [])
      ],
      group: ['vetementId', 'vetement.id'],
      order: [[sequelize.literal('totalQuantite'), 'DESC']],
      limit,
      raw: false
    });

    return topVetements;
  }

  static async getGlobalStats(boutiqueId?: number) {
    const caTotal = await this.calculateCA(boutiqueId);
    const ordersStats = await this.calculateOrdersStats(boutiqueId);

    const whereClause: any = {};
    if (boutiqueId) whereClause.boutiqueId = boutiqueId;

    const nbClients = await Client.count({ where: whereClause });

    return {
      caTotal,
      nbClients,
      ...ordersStats
    };
  }

  static async getStatsByPeriod(startDate: Date, endDate: Date, boutiqueId?: number) {
    const period = { startDate, endDate };

    const caTotal = await this.calculateCA(boutiqueId, period);
    const ordersStats = await this.calculateOrdersStats(boutiqueId, period);

    return {
      periode: { startDate, endDate },
      caTotal,
      ...ordersStats
    };
  }
}
