import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authConfig } from '../config/auth.config';
import { RoleUtilisateur } from '../models/utilisateur.model';

interface TokenPayload {
  id: number;
  email: string;
  role: RoleUtilisateur;
  boutiqueId?: number;
  nom: string;
}

export class AuthService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, authConfig.jwtSecret, {
      expiresIn: authConfig.jwtExpiresIn as any
    });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, authConfig.bcryptSaltRounds);
  }

  static async comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}
