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

export interface Roles{
  roleId?: number,
  roleName?:string,
  roleDescription?:string
}

export interface UserAdd{
     userId?: number,
     firstName?: string,
     lastName?: string,
     email?: string,
     contactNo ?: number
     roleId?: number,
     creatorId?: number,
     status?:number,
     projectIds?: number[],
    projects?: number[]
}