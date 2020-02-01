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

}

export interface UserDetailsPopUpData {
  isDelete?: boolean;
  isEdit: boolean;
  detail?: AllUserDetails;
}

export interface UserIds {
  userIds?: Array<Number>;
}

export interface Roles{
  roleId?: number,
  roleName?:string,
  roleDescription?:string
}