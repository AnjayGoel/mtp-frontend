import {APIClient} from "./utils";

export interface SignupParams {
  email: string,
  hall: string,
  year: string,
  department: string
}

export const signupRequest = async (signupParams: SignupParams) => {
  return await APIClient.request(
    {
      url: '/player/signup',
      method: 'POST',
      data: signupParams
    }
  )
}

export interface checkSignedUpResponse {
  exists: boolean
}

export const checkSignedUp = async () => {
  const data: checkSignedUpResponse =  await APIClient.request(
    {
      url: '/player/check',
      method: 'GET'
    }
  )
  return data
}
