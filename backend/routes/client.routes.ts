import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { clientValidators } from '../utils/validators';

const router = Router();

router.post(
  '/',
  authenticate,
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
