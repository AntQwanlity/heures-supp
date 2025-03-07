export type LoginToken = string;

export type GoogleAuthResponse = {
  token: LoginToken;
  email: string;
};
export interface AuthService {
  initialize(): void;

  signUp(email: string, password: string): Promise<LoginToken>;
  login(email: string, password: string): Promise<LoginToken>;

  deleteUser(): Promise<void>;

  googleSignUp(): Promise<GoogleAuthResponse>;
  googleLogin(): Promise<GoogleAuthResponse>;

  resetPassword(email: string): Promise<void>;
}
