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
