import bcrypt from 'bcrypt';

export async function hash(password: string): Promise<string> {
  const saltRound: number = Number(process.env.SALT_ROUND);
  const salt = await bcrypt.genSalt(saltRound);
  const result = await bcrypt.hash(password, salt);
  return result;
}

export async function verify(
  password: string,
  encrypted: string
): Promise<boolean> {
  const result = await bcrypt.compare(password, encrypted);
  return result;
}
