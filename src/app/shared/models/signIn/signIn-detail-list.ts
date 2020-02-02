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

  export interface SignInData{
    userName:string;
    password:string;
    grant_type:string;
    client_id:string;
    userType:string;
  }
  export interface CustonDataDetails{
    // photo: string;
    organizationName: string;
    organizationType: string;
  }