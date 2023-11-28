interface MetaData {
  currentpage: number;
  totalPages: number;
  totalRecord: number;
  limit: number;
}

interface LoggedInResponse {
  token: string;
  user: {
    id: number,
    roleId: number,
  };
}

interface RequestUser {
  id: number;
  roleId: number;
  iat: number;
  exp: number;
}
