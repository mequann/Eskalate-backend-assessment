
import { UserModel } from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { verifyPassword } from '../utils/password';
import type { SignupDTO, LoginDTO } from '../validators/user.validator';

export const AuthService = {
  async signup(data: SignupDTO) {
    const user = await UserModel.create(data);
    return user;
  },

  async login(data: LoginDTO) {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const validPassword = await verifyPassword(data.password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      sub: user.id,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
};