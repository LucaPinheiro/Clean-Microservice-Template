import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/user";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { Repository } from "../repositories/repository";
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from "../helpers/exceptions";
import { RegisterUserSchema } from "app/schemas/register_user";
import { HTTPError, HTTPRequest, HTTPResponse } from "app/schemas/http";

export class RegisterUserUseCase {
  private userRepo: IUserRepository;

  constructor() {
    const repository = new Repository(true);
    if (!repository.userRepo) {
      throw new Error("User repository not initialized");
    }
    this.userRepo = repository.userRepo;
  }

  async execute(schema: RegisterUserSchema): Promise<User> {
    const existingUser = await this.userRepo.fetchUserByEmail(schema.email);
    if (existingUser) {
      throw new UnprocessableEntityException(
        "User with this email already exists."
      );
    }

    const user = new User(uuidv4(), schema.name, schema.email, schema.password);

    const createdUser = await this.userRepo.createUser(user);
    if (!createdUser) {
      throw new UnprocessableEntityException(
        "Failed to create user, please try again later."
      );
    }

    return createdUser;
  }
}

export class RegisterUserController {
  static async execute(request: HTTPRequest): Promise<HTTPResponse> {
    try {
      const schema = RegisterUserSchema.parse(request.body);
      const useCase = new RegisterUserUseCase();
      const createdUser = await useCase.execute(schema);

      return new HTTPResponse(
        201,
        {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
        },
        "User registered successfully"
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return new HTTPError(401, "Unauthorized");
      } else if (error instanceof UnprocessableEntityException) {
        return new HTTPError(422, error.message);
      } else {
        console.error(error);
        return new HTTPError(
          500,
          "Failed to register user, please try again later."
        );
      }
    }
  }
}

export const lambdaHandler = async (event: any): Promise<any> => {
  const request = new HTTPRequest(event);
  const response = await RegisterUserController.execute(request);
  return response.toDJson();
};
