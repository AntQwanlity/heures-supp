import { FirebaseUser } from "core/components/auth/domain/firebase-user";

export abstract class FirebaseUserRepository {
  abstract getByUserId(userId: string): Promise<FirebaseUser>;
  abstract getByFirebaseId(firebaseId: string): Promise<FirebaseUser>;

  abstract create(firebaseUser: FirebaseUser): Promise<void>;
}
