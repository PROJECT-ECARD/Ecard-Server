export interface JwtPayload {
    email: string;
    role?: string;
    expiresIn?: string
  }