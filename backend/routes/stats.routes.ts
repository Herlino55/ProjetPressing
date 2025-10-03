import { Router } from 'express';
import { StatsController } from '../controllers/stats.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.get(
  '/global',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  StatsController.getGlobalStats
);

router.get(
  '/boutique/:boutiqueId',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  StatsController.getStatsByBoutique
);

router.get(
  '/period',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  StatsController.getStatsByPeriod
);

router.get(
  '/top-clients',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  StatsController.getTopClients
);

router.get(
  '/top-vetements',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  StatsController.getTopVetements
);

export default router;
