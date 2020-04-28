export interface ReleaseNotes {
headerText ?: string;
description ?: string ;
releaseList? : ReleaseList[];
}
  export interface ReleaseList{
    releaseHead ? : string;
    items ?: ReleaseItems[];
  
  }
  export interface ReleaseItems{
      description ?: string
  }