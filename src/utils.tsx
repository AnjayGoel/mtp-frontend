import jwt_decode from "jwt-decode";

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
