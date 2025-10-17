import { Router } from 'express';
import { UtilisateurController } from '../controllers/utilisateur.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { utilisateurValidators } from '../utils/validators';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.post('/login', validate(utilisateurValidators.login), UtilisateurController.login);
// router.post('/register', validate(utilisateurValidators.create), UtilisateurController.register);

router.get('/profile', authenticate, UtilisateurController.getProfile);

router.post(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  validate(utilisateurValidators.create),
  UtilisateurController.createUtilisateur
);

router.get(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  UtilisateurController.getUtilisateurs
);

router.get(
  '/:id',
  authenticate,
  UtilisateurController.getUtilisateurById
);

router.put(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  UtilisateurController.updateUtilisateur
);

router.delete(
  '/:id',
  authenticate,
  authorize(RoleUtilisateur.ADMIN),
  UtilisateurController.deleteUtilisateur
);

export default router;
