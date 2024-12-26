export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  accessToken?: string;
  createdAt?: Date;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export type SignupFormState =
  | {
    errors?: {
      name?: string[];
      email?: string[];
      password?: string[];
      role?: string[];
    };
    message?: string;
  }
  | undefined;


export interface Property {
  id: string;
  userId: string;
  name: string;
  description: string;
  type: 'MULTI_FAMILY' | 'SINGLE_FAMILY' | 'COMMERCIAL' | 'LAND' | 'OTHER';
  status: 'AVAILABLE' | 'OCCUPIED' | 'UNDER_CONTRACT' | 'SOLD';
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  purchasePrice: string;
  currentValue: string;
  appreciationRate: string;
  rentalStatus: 'LEASED' | 'VACANT' | 'UNDER_MAINTENANCE';
  monthlyRent: string;
  purchaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  _count: Record<string, any>;
};

export interface Member {
  email: string;
  role: string;
}