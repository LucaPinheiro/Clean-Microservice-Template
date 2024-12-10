import { User } from "../../entities/user";

export interface IUserRepository {
  /**
   * Create a new user
   * @param user - The user to be created
   * @returns The created user
   */
  createUser(user: User): Promise<User>;

  /**
   * Fetch all users
   * @returns An array of users
   */
  fetchUsers(): Promise<User[]>;

  /**
   * Fetch a user by email
   * @param email - The user's email
   * @returns The user with the given email
   */
  fetchUserByEmail(email: string): Promise<User | null>;
}
