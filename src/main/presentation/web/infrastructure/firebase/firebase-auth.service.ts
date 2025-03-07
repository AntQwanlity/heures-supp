import { getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  AuthService,
  GoogleAuthResponse,
  LoginToken,
} from "presentation/web/core/ports/auth/auth-service";

export class FirebaseAuthService implements AuthService {
  initialize() {
    if (getApps().length === 0) {
      initializeApp({
        // TODO : should this be hardcoded ?
        apiKey: "",
        authDomain: "heures-supp-prod.firebaseapp.com",
      });

      if (process.env.NODE_ENV === "development")
        // TODO : should this be hardcoded ?
        connectAuthEmulator(getAuth(), "http://localhost:9099", { disableWarnings: true });

      // As httpOnly cookies are to be used, do not persist any state client side.
      getAuth().setPersistence(inMemoryPersistence);
    }
  }

  async login(email: string, password: string): Promise<LoginToken> {
    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
      return await userCredential.user.getIdToken();
    } catch (e: any) {
      throw new Error("Impossible de vous connecter avec ces identifiants.");
    }
  }

  async signUp(email: string, password: string): Promise<LoginToken> {
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
      return userCredential.user.getIdToken();
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use")
        throw new Error("Cette adresse e-mail est déjà utilisée.");

      if (e.code === "auth/invalid-email") throw new Error("Cette adresse e-mail est invalide.");
      throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  deleteUser(): Promise<void> {
    try {
      return deleteUser(getAuth().currentUser!);
    } catch (e: any) {
      throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  async googleSignUp(): Promise<GoogleAuthResponse> {
    return this.googleLogin();
  }

  async googleLogin(): Promise<GoogleAuthResponse> {
    try {
      const userCredential = await signInWithPopup(getAuth(), new GoogleAuthProvider());
      const email = userCredential.user.providerData[0].email!;
      return { token: await userCredential.user.getIdToken(), email };
    } catch (e: any) {
      if (e.code === "auth/email-already-in-use")
        throw new Error("Cette adresse e-mail est déjà utilisée.");

      if (e.code === "auth/invalid-email") throw new Error("Cette adresse e-mail est invalide.");

      throw new Error("Une erreur est survenue. Veuillez réessayer.");
    }
  }

  async resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(getAuth(), email, {
      url:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/app/login"
          : "https://heures-supp.fr/app/login",
    });
  }
}
