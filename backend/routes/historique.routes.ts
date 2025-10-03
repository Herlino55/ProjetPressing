import { Router } from 'express';
import { HistoriqueController } from '../controllers/historique.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  HistoriqueController.getHistoriqueGlobal
);

router.get(
  '/boutique/:boutiqueId',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  HistoriqueController.getHistoriqueByBoutique
);

router.get(
  '/utilisateur/:userId',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  HistoriqueController.getHistoriqueByUtilisateur
);

export default router;
