interface userI {
  fullname: string;
  password: string;
  email: string;
  area?: string;
  state: boolean;
}

interface reqBody {
  name: string;
  lastname: string;
  password: string;
  email: string;
  area: string;
}

export { userI, reqBody };
