import jwt_decode from "jwt-decode";
import axios, {AxiosInstance} from "axios";

export const getUserInfo = () => {
  if (localStorage.getItem("token") !== null) {
    let token = localStorage.getItem('token') as string
    let user = jwt_decode(token) as any

    if (user.exp < Math.floor(Date.now() / 1000)) {
      return null
    } else {
      return user
    }

  } else {
    return null
  }
}


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


export const getUseQueryOptions = (
  retry: boolean | number = 1,
  staleTime: number = 60 * 1000,
  enabled: boolean = true
) => {
  return {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: staleTime,
    retry: retry,
    enabled: enabled,
  }
}
