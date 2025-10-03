import { Router } from 'express';
import { CommandeController } from '../controllers/commande.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { commandeValidators } from '../utils/validators';

const router = Router();

router.post(
  '/',
  authenticate,
  validate(commandeValidators.create),
  CommandeController.createCommande
);

router.get(
  '/',
  authenticate,
  CommandeController.getCommandes
);

router.get(
  '/client/:clientId',
  authenticate,
  CommandeController.getCommandesByClient
);

router.get(
  '/boutique/:boutiqueId',
  authenticate,
  CommandeController.getCommandesByBoutique
);

router.get(
  '/:id',
  authenticate,
  CommandeController.getCommandeById
);

router.put(
  '/:id',
  authenticate,
  CommandeController.updateCommande
);

router.patch(
  '/:id/statut',
  authenticate,
  validate(commandeValidators.updateStatus),
  CommandeController.updateCommandeStatus
);

router.delete(
  '/:id',
  authenticate,
  CommandeController.deleteCommande
);

export default router;
