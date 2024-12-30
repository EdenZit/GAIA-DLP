import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

export async function verifyPassword(password: string, hashedPassword: string) {
  try {
    console.log('Verifying password');
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password verification result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}
