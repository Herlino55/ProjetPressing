import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { Utilisateur, Boutique, Historique } from '../models';
import { AuthService } from '../services/auth.service';
import { NotFoundError, UnauthorizedError } from '../middlewares/error.middleware';
import { RoleUtilisateur } from '../models/utilisateur.model';
import { TypeAction } from '../models/historique.model';

export class UtilisateurController {
  static async createUtilisateur(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { email, password, ...rest } = req.body;
      
      if(req.user?.boutiqueId && !rest.boutiqueId){
        rest.boutiqueId = req.user.boutiqueId;
      }
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

      await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.CREATE,
        boutiqueId: utilisateur.boutiqueId,
        entite: 'utilisateur',
        entiteId: utilisateur.id,
        description: `Création de l'utilisateur ${utilisateur.nom}`
      });

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

      if (req.user?.boutiqueId) {
        whereClause.boutiqueId = req.user?.boutiqueId;
        whereClause.actif = 'true';
      }



      // if (req.query.actif !== undefined) {
      //   whereClause.actif = req.query.actif === 'true';
      // }

      if(req.user?.role === RoleUtilisateur.ADMIN){
          const utilisateurs = await Utilisateur.findAll({
          include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']]
        });

        res.json({
          success: true,
          data: utilisateurs,
          boutiqueId: req.user?.boutiqueId || null
        });
      }else{

        console.log('wherClause', whereClause)

          const utilisateurs = await Utilisateur.findAll({
          where: whereClause,
          include: [{ model: Boutique, as: 'boutique', attributes: ['id', 'nom'] }],
          attributes: { exclude: ['password'] },
          order: [['createdAt', 'DESC']]
        });

        res.json({
          success: true,
          data: utilisateurs,
        });

      }
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

      const oldData = { ...utilisateur.toJSON() };

      if (req.body.password) {
        req.body.password = await AuthService.hashPassword(req.body.password);
      }

      await utilisateur.update(req.body);

      const userResponse = utilisateur.toJSON() as any;
      delete userResponse.password;

      await Historique.create({
        utilisateurId: req.user?.id,
        boutiqueId: utilisateur.boutiqueId,
        typeAction: TypeAction.UPDATE,
        entite: 'utilisateur',
        entiteId: utilisateur.id,
        description: `Modification de l'utilisateur ${utilisateur.nom}`,
        detailsAvant: oldData,
        detailsApres: utilisateur.toJSON()
      });

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

      const utilisateurData = { ...utilisateur.toJSON()}

      
      if(parseInt(req.params.id) === 12){
         res.status(400).json({
          success: false,
          message: 'impossible de supprimer l\'admin'
        });
        return;
      }

      utilisateur.actif = false;

      await utilisateur.save();

      // await utilisateur.destroy();

       await Historique.create({
        utilisateurId: req.user?.id,
        typeAction: TypeAction.DELETE,
        boutiqueId: utilisateur.boutiqueId,
        entite: 'utilisateur',
        entiteId: utilisateur.id,
        description: `Suppression de l'utilisateur ${utilisateur.nom}`,
        detailsAvant: utilisateurData
      });

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

      if(utilisateur.actif === false){
        throw new UnauthorizedError('Compte utilisateur désactivé');
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

      await Historique.create({
        utilisateurId: utilisateur.id,
        typeAction: TypeAction.LOGIN,
        boutiqueId: utilisateur.boutiqueId,
        entite: 'utilisateur',
        entiteId: utilisateur.id,
        description: `connexion ${utilisateur.role === 'gerant' ? 'du':'de l\''} ${utilisateur.role} ${utilisateur.nom}`
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

  // static async register(req: AuthRequest, res: Response): Promise<void> {
  //   try {
  //     const { email, password, ...rest } = req.body;

  //     const existingUser = await Utilisateur.findOne({ where: { email } });
  //     if (existingUser) {
  //       res.status(400).json({
  //         success: false,
  //         message: 'Cet email est déjà utilisé'
  //       });
  //       return;
  //     }

  //     const hashedPassword = await AuthService.hashPassword(password);

  //     const utilisateur = await Utilisateur.create({
  //       ...rest,
  //       email,
  //       password: hashedPassword
  //     });

  //     const token = AuthService.generateToken({
  //       id: utilisateur.id,
  //       email: utilisateur.email,
  //       role: utilisateur.role,
  //       boutiqueId: utilisateur.boutiqueId,
  //       nom: utilisateur.nom
  //     });

  //     const userResponse = utilisateur.toJSON() as any;
  //     delete userResponse.password;

  //     res.status(201).json({
  //       success: true,
  //       message: 'Inscription réussie',
  //       data: {
  //         token,
  //         user: userResponse
  //       }
  //     });
  //   } catch (error: any) {
  //     res.status(500).json({
  //       success: false,
  //       message: 'Erreur lors de l\'inscription',
  //       error: error.message
  //     });
  //   }
  // }

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

   static async getUtilisateurHistorique(req: AuthRequest, res: Response): Promise<void> {
    try {
      const historique = await Historique.findAll({
        where: { utilisateurId: req.params.id },
        include: [{ model: require('../models/utilisateur.model').default, as: 'utilisateur', attributes: ['id', 'nom', 'prenom'] }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: historique
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de l\'historique',
        error: error.message
      });
    }
  }
}
