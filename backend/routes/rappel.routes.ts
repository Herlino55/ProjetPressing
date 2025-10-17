import { Router } from 'express';
import { RappelController } from '../controllers/rappel.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { rappelValidators } from '../utils/validators';

const router = Router();

router.post(
  '/',
  authenticate,
  validate(rappelValidators.create),
  RappelController.createRappel
);

router.get(
  '/',
  authenticate,
  RappelController.getRappels
);

router.get(
  '/client/:clientId',
  authenticate,
  RappelController.getAllRappelsByClient
);

router.get(
  '/boutique/:boutiqueId',
  authenticate,
  RappelController.getAllRappelsByBoutique
);

router.get(
  '/:id',
  authenticate,
  RappelController.getRappelById
);

router.delete(
  '/:id',
  authenticate,
  RappelController.deleteRappel
);

export default router;