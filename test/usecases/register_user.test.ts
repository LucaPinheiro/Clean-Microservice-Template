import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserRepoMock } from "../../app/repositories/mocks/user_repository_mock";
import { RegisterUserUseCase } from "../../app/routes/register_user";
import { UnprocessableEntityException } from "../../app/helpers/exceptions";

describe("RegisterUserUseCase", () => {
  let userRepoMock: UserRepoMock;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepoMock = new UserRepoMock();
    vi.spyOn(userRepoMock, "fetchUserByEmail");
    vi.spyOn(userRepoMock, "createUser");

    // Injecting the mock repository
    registerUserUseCase = new RegisterUserUseCase();
    registerUserUseCase["userRepo"] = userRepoMock;
  });

  it("should register a new user successfully", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "SecurePass123",
    };

    const result = await registerUserUseCase.execute(newUser);

    expect(result).toHaveProperty("id");
    expect(result.name).toBe(newUser.name);
    expect(result.email).toBe(newUser.email);
    expect(userRepoMock.createUser).toHaveBeenCalledOnce();
  });

  it("should throw UnprocessableEntityException if the email is already registered", async () => {
    const existingUser = {
      name: "Matuê",
      email: "matue@30praum.com.br",
      password: "Gorila-roxo333",
    };

    await expect(registerUserUseCase.execute(existingUser)).rejects.toThrow(
      UnprocessableEntityException
    );

    expect(userRepoMock.fetchUserByEmail).toHaveBeenCalledOnce();
    expect(userRepoMock.createUser).not.toHaveBeenCalled();
  });

  it("should throw UnprocessableEntityException if user creation fails", async () => {
    const newUser = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "SecurePass123",
    };

    vi.spyOn(userRepoMock, "createUser").mockImplementation(() => {
      throw new UnprocessableEntityException();
    });

    await expect(registerUserUseCase.execute(newUser)).rejects.toThrow(
      UnprocessableEntityException
    );

    expect(userRepoMock.fetchUserByEmail).toHaveBeenCalledOnce();
    expect(userRepoMock.createUser).toHaveBeenCalledOnce();
  });
});
