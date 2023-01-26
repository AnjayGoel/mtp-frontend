import axios, {AxiosInstance} from "axios";

export class APIClient {
  static instance: APIClient;
  axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env["REACT_APP_BASE_URL"]
    });
  }

  public static async request(config: any) {
    config.headers = {
      'Authorization': 'Bearer ' + localStorage.getItem("token"),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
    return (await APIClient.getInstance().axiosInstance.request(config)).data
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }
}


export interface SignupParams {
  email: string,
  hall: string,
  year: string,
  department: string
}

export const signUp = async (signupParams: SignupParams) => {
  return await APIClient.request(
    {
      url: '/player/',
      method: 'POST',
      data: signupParams
    }
  )
}

export interface checkSignedUpResponse {
  exists: boolean
}

export const checkSignedUp = async () => {
  const data: checkSignedUpResponse = await APIClient.request(
    {
      url: '/player/check',
      method: 'GET'
    }
  )
  return data
}

