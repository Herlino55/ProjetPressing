import { Router } from 'express';
import { CommandeDetailController } from '../controllers/commandeDetail.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/:commandeId/details',
  authenticate,
  CommandeDetailController.addDetailToCommande
);

router.get(
  '/:commandeId/details',
  authenticate,
  CommandeDetailController.getDetailsByCommande
);

router.put(
  '/details/:detailId',
  authenticate,
  CommandeDetailController.updateDetail
);

router.delete(
  '/details/:detailId',
  authenticate,
  CommandeDetailController.removeDetail
);

export default router;
