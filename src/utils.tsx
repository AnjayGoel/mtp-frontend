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
export const isProd = (): boolean => {
  return process.env.REACT_APP_ENV === 'prod'
}

export const getSuperscript = (num: string) => {
  switch (parseInt(num)) {
    case 1:
      return <span>1<sup>st</sup></span>
    case 2:
      return <span>2<sup>nd</sup></span>
    case 3:
      return <span>1<sup>rd</sup></span>
    case 4:
      return <span>4<sup>th</sup></span>
    case 5:
      return <span>5<sup>th</sup></span>

  }
}

export const sleep = (time:number)=>{
  return new Promise((resolve)=>setTimeout(resolve,time)
  )
}
