import { Router } from 'express';
import { PaiementController } from '../controllers/paiement.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { paiementValidators } from '../utils/validators';

const router = Router();

router.post(
  '/',
  authenticate,
  validate(paiementValidators.create),
  PaiementController.createPaiement
);

router.get(
  '/',
  authenticate,
  PaiementController.getPaiements
);

router.get(
  '/commande/:commandeId',
  authenticate,
  PaiementController.getPaiementsByCommande
);

router.get(
  '/boutique/:boutiqueId',
  authenticate,
  PaiementController.getPaiementsByBoutique
);

router.get(
  '/:id',
  authenticate,
  PaiementController.getPaiementById
);

router.put(
  '/:id',
  authenticate,
  PaiementController.updatePaiement
);

router.delete(
  '/:id',
  authenticate,
  PaiementController.deletePaiement
);

export default router;
