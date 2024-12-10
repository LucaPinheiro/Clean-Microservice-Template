export class User {
    constructor(
      public id: string,
      public name: string,
      public email: string,
      private password: string 
    ) {}
  
    toJson(): { id: string; name: string; email: string } {
      return {
        id: this.id,
        name: this.name,
        email: this.email
      };
    }
  }
  
  