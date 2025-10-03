import { Router } from 'express';
import { BoutiqueController } from '../controllers/boutique.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validation.middleware';
import { boutiqueValidators } from '../utils/validators';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  uploadSingle('logo'),
  validate(boutiqueValidators.create),
  BoutiqueController.createBoutique
);

router.get(
  '/',
  authenticate,
  BoutiqueController.getBoutiques
);

router.get(
  '/:id',
  authenticate,
  BoutiqueController.getBoutiqueById
);

router.put(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  uploadSingle('logo'),
  validate(boutiqueValidators.update),
  BoutiqueController.updateBoutique
);

router.delete(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  BoutiqueController.deleteBoutique
);

router.get(
  '/:id/historique',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  BoutiqueController.getBoutiqueHistorique
);

export default router;
