import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Utilisateur, Boutique } from '../models';
import { AuthService } from '../services/auth.service';
import { NotFoundError, UnauthorizedError } from '../middlewares/error.middleware';

export class UtilisateurController {
  static async createUtilisateur(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, ...rest } = req.body;

      const existingUser = await Utilisateur.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
        return;
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const utilisateur = await Utilisateur.create({
        ...rest,
        email,
        password: hashedPassword
      });

      const userResponse = utilisateur.toJSON() as any;
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: userResponse
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.message
      });
    }
  }

  static async getUtilisateurs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const whereClause: any = {};

      if (req.query.role) {
        whereClause.role = req.query.role;
      }

      if (req.query.boutiqueId) {
        whereClause.boutiqueId = req.query.boutiqueId;
      }

      if (req.query.actif !== undefined) {
        whereClause.actif = req.query.actif === 'true';
      }

      const utilisateurs = await Utilisateur.findAll({
        where: whereClause,
        include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: utilisateurs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        error: error.message
      });
    }
  }

  static async getUtilisateurById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const utilisateur = await Utilisateur.findByPk(req.params.id, {
        include: [{ model: Boutique, as: 'boutique' }],
        attributes: { exclude: ['password'] }
      });

      if (!utilisateur) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      res.json({
        success: true,
        data: utilisateur
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateUtilisateur(req: AuthRequest, res: Response): Promise<void> {
    try {
      const utilisateur = await Utilisateur.findByPk(req.params.id);

      if (!utilisateur) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      if (req.body.password) {
        req.body.password = await AuthService.hashPassword(req.body.password);
      }

      await utilisateur.update(req.body);

      const userResponse = utilisateur.toJSON() as any;
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        data: userResponse
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteUtilisateur(req: AuthRequest, res: Response): Promise<void> {
    try {
      const utilisateur = await Utilisateur.findByPk(req.params.id);

      if (!utilisateur) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      await utilisateur.destroy();

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const utilisateur = await Utilisateur.findOne({
        where: { email, actif: true },
        include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }]
      });

      if (!utilisateur) {
        throw new UnauthorizedError('Email ou mot de passe incorrect');
      }

      const isPasswordValid = await AuthService.comparePassword(password, utilisateur.password);

      if (!isPasswordValid) {
        throw new UnauthorizedError('Email ou mot de passe incorrect');
      }

      const token = AuthService.generateToken({
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        boutiqueId: utilisateur.boutiqueId,
        nom: utilisateur.nom
      });

      const userResponse = utilisateur.toJSON() as any;
      delete userResponse.password;

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: userResponse
        }
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  static async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, ...rest } = req.body;

      const existingUser = await Utilisateur.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
        return;
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const utilisateur = await Utilisateur.create({
        ...rest,
        email,
        password: hashedPassword
      });

      const token = AuthService.generateToken({
        id: utilisateur.id,
        email: utilisateur.email,
        role: utilisateur.role,
        boutiqueId: utilisateur.boutiqueId,
        nom: utilisateur.nom
      });

      const userResponse = utilisateur.toJSON() as any;
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          token,
          user: userResponse
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription',
        error: error.message
      });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const utilisateur = await Utilisateur.findByPk(req.user?.id, {
        include: [{ model: Boutique, as: 'boutique' }],
        attributes: { exclude: ['password'] }
      });

      if (!utilisateur) {
        throw new NotFoundError('Utilisateur non trouvé');
      }

      res.json({
        success: true,
        data: utilisateur
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}
