import { Env, StageEnum } from "../env";
import { IUserRepository } from "./interfaces/IUserRepository";
import { UserRepoMock } from "./mocks/user_repository_mock";

export class Repository {
  userRepo: IUserRepository | null = null;
//   private prisma: PrismaClient | null = null;

  constructor(
    useUserRepo: boolean = false
  ) {
    if (Env.STAGE === StageEnum.TEST) {
      this.initializeMockRepositories(useUserRepo);
    } else {
    //   this.initializeRealRepositories(useUserRepo);
    }
  }

  private initializeMockRepositories(useUserRepo: boolean) {
    if (useUserRepo) {
      this.userRepo = new UserRepoMock();
    }
  }

//   private initializeRealRepositories(useUserRepo: boolean) {
//     this.prisma = new PrismaClient();

//     if (useUserRepo) {
//       this.userRepo = new UserRepository(this.prisma);
//     }
//   }


//   async closeConnections() {
//     if (this.prisma) {
//       await this.prisma.$disconnect();
//       this.prisma = null;
//     }
//   }
}
