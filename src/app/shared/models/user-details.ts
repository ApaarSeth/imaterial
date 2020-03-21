import { ProjectDetails } from './project-details';

export interface AllUserDetails {
  firstName?: string,
  lastName?: string,
  userId?: number,
  email?: string,
  contactNo?: number,
  accountStatus?: number,
  status?: number,
  roleName?: number,
  roleId?: number,
  projectId?: number,
  projectName?: string,
  ProjectList?: ProjectDetails[];

  ProjectUser?: UserAdd;


}

export interface UserDetailsPopUpData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: UserAdd;
}

export interface UserIds {
  userIds?: Array<Number>;
}

export interface Roles {
  roleId?: number,
  roleName?: string,
  roleDescription?: string
}

export interface UserAdd {
  userId?: number,
  firstName?: string,
  lastName?: string,
  email?: string,
  contactNo?: number
  roleId?: number,
  creatorId?: number,
  status?: number,
  projectIds?: number[],
  projects?: number[],
  accountStatus?: number,
}

export interface UserRoles {
  roleId: number;
  roleName: string;
  roleDescription: string;
}

export interface UserDetails {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  firstName: string;
  lastName: string;
  userId: number;
  email: string;
  contactNo: string;
  accountStatus: number;
  roleName: string;
  roleId: number;
  roleDescription?: string;
  projectId?: number;
  projectName?: string;
  addressId?: number;
  addressShortname?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  ssoId?: number;
  state?: string;
  pinCode?: string;
  country?: string;
  gstNo?: string;
  addressType?: string;
  primaryAddress?: string;
  organizationName?: string;
  organizationType?: string;
  organizationId: number;
  profileUrl?: string;
  profileImageUrl?: string;
  ssoUserId?: number;
  userType?: string;
  accountOwner?: number;
  countryCode?: string;
  uniqueCode?: string;
  companyName?: string;
    turnOverId?: number;
}

export interface TradeList {
  id: number;
  status: number;
  createdBy: string;
  createdAt: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
  tradeId: number;
  tradeName: string;
  tradeDescription: string;
  selected?: boolean;
}
export interface TurnOverList{
  id ?: number;
  status ?: number;
  createdBy ?: string;
  createdAt ?: string;
  lastUpdatedBy ?:  string;
  lastUpdatedAt ?:  string;
  turnOverId ?:  number;
  shortName ?:  string;
  longName ?:  string;
 
}