export class DataServiceOptions {
  skipLoader?: boolean;
  cache?: boolean;
  requestURL?: string;
  headers?: string;
}

export class ResponseFormat {
  data: any;
  status?: number;
}
