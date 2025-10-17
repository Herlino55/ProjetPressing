import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth.config';
import { RoleUtilisateur } from '../models/utilisateur.model';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: RoleUtilisateur;
    boutiqueId?: number;
    nom: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token non fourni ou invalide' });
      return;
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, authConfig.jwtSecret) as any;
    req.user = decoded;
    // console.log('user', req.user);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export const authorize = (...roles: RoleUtilisateur[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Accès refusé: permissions insuffisantes' });
      return;
    }

    next();
  };
};

export const checkBoutiqueAccess = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'Non authentifié' });
    return;
  }

  const boutiqueId = parseInt(req.params.boutiqueId || req.body.boutiqueId);

  if (req.user.role === RoleUtilisateur.ADMIN) {
    next();
    return;
  }

  if (!req.user.boutiqueId || req.user.boutiqueId !== boutiqueId) {
    res.status(403).json({ message: 'Accès refusé à cette boutique' });
    return;
  }

  next();
};
