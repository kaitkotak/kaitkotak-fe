interface IUserResponse {
  id?: string;
  name: string;
  username: string;
  job_title: string;
  password: string;
  permissions: IPermissionLis[];
}

interface IPermissionList {
  id: number;
  name: string;
  code: string;
  items: IPermissionItem[];
}

interface IPermissionItem {
  id: number;
  name: string;
  code: string;
  value: boolean;
}

interface IUserPayload {
  id?: string;
  name: string;
  username: string;
  job_title: string;
  password?: string;
  permissions: number[];
}
