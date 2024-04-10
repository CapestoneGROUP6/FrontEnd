export type ActionTypes = "LOGIN" | "LOGOUT" | "SAVE_USER";
export type Payload = {
  user?: User;
  token?: string;
};


export type GenericResponse = {
  status: boolean;
  token: string;
  message: string
};


export type LoginSignUpResponse = {
  status: boolean;
  token: string;
  message: string
};

export type CustomDispatchAction = {
  type: ActionTypes;
  payload: Payload;
};

export type User = {
  ID: number;
  NAME: string;
  EMAIL: string;
  MOBILE: string | null;
  ADDRESS: string | null;
  ZIPCODE: string | null;
  ROLE: string | null;
};

export interface GlobalContextState {
  loggedIn: boolean;
  user: User;
  token: string;
}

export interface GlobalContext extends GlobalContextState {
  dispatch: React.Dispatch<CustomDispatchAction>;
}

export type Book = {
  ID: number;
  NAME: string;
  PRICE: string;
  Category_ID: number;
  User_ID: number;
  IsAdminApproved: number;
  Image: string;
  Description: string;
};

export type OrderInformation = {
  orderItems: { itemDetails: Book, quantity: number }[],
  orderid: number,
  total: number
}
