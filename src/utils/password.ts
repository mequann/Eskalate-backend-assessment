import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};