export interface User {
  name: string;
  email: string;
  id: string;
}

export interface SignInParams {
  email: string;
  idToken: string;
}

export interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

export type FormType = "sign-in" | "sign-up";
