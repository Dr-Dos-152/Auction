import { StatusCodes } from "http-status-codes"

const fetchVerifyCredentials = async () => {
  try {
    const response = await fetch("/auth/verifyCredentials", {
      redirect: "error",
    })

    if (response.status === StatusCodes.OK) {
      const data = await response.json()
      return {
        isAuthenticated: true,
        userName: data.userName,
      }
    }
  } catch (e) {
    console.warn(e)
  }
  return {
    isAuthenticated: false,
    userName: "",
  }
}

export default fetchVerifyCredentials
