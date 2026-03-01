type User = {
    id: string;
    info: userInfo;
    setup: userSetup;
    session?: any;
    company: companyInfo | null;
};

type userSetup = {
    language: LanguageOption;
    notifications: boolean;

};

type companyInfo = {
    name: string;
    phone: string;
    type: string;
    address: AddressType;
    job?:{
        name: string;
    }
}

type AddressType = {
    street: string;
    postalCode: string;
    city: string;
    country: string;
}



type userInfo = {
    firstName: string;
    lastName: string;
    city: string | null;
    postalCode: string | null;
    country: string | null;
    photoUrl: string;
    email: string;
    phone: string | null;
    created_at: string;
    role : RoleProps;
};

type LanguageOption = {
    code: string;
    id: number;
};

interface AuthResponse {
  user: User
  token: string
}

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  companyName: string
  password: string
  confirmPassword: string
}

interface RoleProps {
  id: string;
  type: 'USER' | 'ADMIN' | 'MANAGER';
  value: string;
};



export type {
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  RoleProps,
  LanguageOption,
  AddressType,
  companyInfo,
  userInfo,
  userSetup
};
