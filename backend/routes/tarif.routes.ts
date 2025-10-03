import { Router } from 'express';
import { TarifController } from '../controllers/tarif.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { tarifValidators } from '../utils/validators';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  validate(tarifValidators.create),
  TarifController.createTarif
);

router.get(
  '/',
  authenticate,
  TarifController.getTarifs
);

router.get(
  '/vetement/:vetementId',
  authenticate,
  TarifController.getTarifByVetement
);

router.get(
  '/:id',
  authenticate,
  TarifController.getTarifById
);

router.put(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  TarifController.updateTarif
);

router.delete(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  TarifController.deleteTarif
);

export default router;
