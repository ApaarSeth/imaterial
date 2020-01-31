export interface UserDetails {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNo?: number;
  role?: string;

  userId?: number;
  project?: Array<string>;
}

export interface UserDetailsPopUpData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: UserDetails;
}

export interface UserIds {
  userIds?: Array<Number>;
}
