import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import boutiqueRoutes from '../routes/boutique.routes';
import utilisateurRoutes from '../routes/utilisateur.routes';
import clientRoutes from '../routes/client.routes';
import vetementRoutes from '../routes/vetement.routes';
import tarifRoutes from '../routes/tarif.routes';
import commandeRoutes from '../routes/commande.routes';
import rappelRoutes from '../routes/rappel.routes';
import commandeDetailRoutes from '../routes/commandeDetail.routes';
import paiementRoutes from '../routes/paiement.routes';
import historiqueRoutes from '../routes/historique.routes';
import statsRoutes from '../routes/stats.routes';

import { errorHandler, notFound } from '../middlewares/error.middleware';

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Pressing - Bienvenue',
    version: '1.0.0',
    endpoints: {
      boutiques: '/api/boutiques',
      utilisateurs: '/api/utilisateurs',
      clients: '/api/clients',
      vetements: '/api/vetements',
      tarifs: '/api/tarifs',
      commandes: '/api/commandes',
      paiements: '/api/paiements',
      historique: '/api/historique',
      stats: '/api/stats'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/boutiques', boutiqueRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/vetements', vetementRoutes);
app.use('/api/tarifs', tarifRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/commandes', commandeDetailRoutes);
app.use('/api/rappels', rappelRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
