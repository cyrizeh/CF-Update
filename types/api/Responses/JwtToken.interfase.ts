export interface JwtToken {
  name: string;
  exp: number;
  permissions?: string[];
}