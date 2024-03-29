export interface SignINDetailLists {
  phone: string;
  password: string;
  confirmPassword: string;
  clientId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  countryCode: string;
  customData: CustonDataDetails;
  loginIdType: string;
}

export interface ForgetPassDetails {
  phone: string;
  password: string;
  confirmPassword: string;
  clientId?: string;
  customData: CustonDataDetails;
}

export interface SignInData {
  userName: string;
  password: string;
  grant_type: string;
  client_id: string;
  userType: string;
}
export interface CustonDataDetails {
  countryCode?: string;
  countryId?: string;
  uniqueCode: string;
  organizationName: string;
  organizationType: string;
  userId?: string | number;
  organizationId?: string | number;
}
