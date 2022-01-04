export class LoginError extends Error {
  public login;

  constructor(message: string) {
    super(message);
    this.name = "LoginError";
    this.login = true;
  }

}
