import { Router } from 'express';
import { VetementController } from '../controllers/vetement.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { uploadSingle } from '../middlewares/upload.middleware';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  uploadSingle('image'),
  VetementController.createVetement
);

router.get(
  '/',
  authenticate,
  VetementController.getVetements
);

router.get(
  '/:id',
  authenticate,
  VetementController.getVetementById
);

router.put(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  uploadSingle('image'),
  VetementController.updateVetement
);

router.delete(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  VetementController.deleteVetement
);

export default router;
