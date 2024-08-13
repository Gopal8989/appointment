export interface ICreateService {
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface IUpdateService extends Partial<ICreateService> {}

export interface IServiceCreateRes {
  id: number;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

export interface IServiceDetailsRes extends IServiceCreateRes {
  createdAt: Date;
  updatedAt: Date;
}
