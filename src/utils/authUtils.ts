import { StatusCodes } from "http-status-codes"

const fetchVerifyCredentials = async () => {
  try {
    const response = await fetch("/auth/verifyCredentials", {
      redirect: "error",
    })
    if (response.status === StatusCodes.OK) {
      return true
    }
  } catch (e) {
    console.warn(e)
  }
  return false
}

export default fetchVerifyCredentials
