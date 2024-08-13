export interface ISignIn {
  email: string;
  password: string;
}

export interface ICreateUser extends ISignIn {
  firstName: string;
  lastName: string;
}

export interface IUserCreateRes {
  id: number;
  firstName: string;
  lastName: string;
  isActive: boolean;
  email: string;
}
