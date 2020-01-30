export interface SignINDetailLists {
    phone: string;
    password: string;
    confirmPassword: string;
    clientId: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    customData: CustonDataDetails;
  }

  export interface CustonDataDetails{
    // photo: string;
    organizationName: string;
    organizationType: string;
  }