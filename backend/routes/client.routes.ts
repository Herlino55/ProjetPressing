import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { clientValidators } from '../utils/validators';
import { RoleUtilisateur } from '../models/utilisateur.model';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(RoleUtilisateur.ADMIN, RoleUtilisateur.GERANT),
  validate(clientValidators.create),
  ClientController.createClient
);

router.get(
  '/',
  authenticate,
  ClientController.getClients
);

router.get(
  '/search',
  authenticate,
  validate(clientValidators.search),
  ClientController.searchClients
);

router.get(
  '/:id',
  authenticate,
  ClientController.getClientById
);

router.put(
  '/:id',
  authenticate,
  ClientController.updateClient
);

router.delete(
  '/:id',
  authenticate,
  ClientController.deleteClient
);

export default router;
