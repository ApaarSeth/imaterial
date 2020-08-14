export interface ReleaseNotes {
  headerText?: string;
  subhead?: string;
  description?: string;
  releaseList?: ReleaseList[];
  isDownload?: number;
  downloadLink?: string;
}
export interface ReleaseList {
  releaseFixes?: string;
  releaseEnhancement?: string;
  items?: ReleaseItems[];

}
export interface ReleaseItems {
  description?: string;
}