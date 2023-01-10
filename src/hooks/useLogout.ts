import { useMutation } from "react-query"
import getCookie from "../utils/cookieUtils"

const fetchUseLogout = async () => {
  const csrfToken = getCookie("XSRF-TOKEN") as string
  console.log("csrfToken", csrfToken)

  const response = await fetch("/auth/logout", {
    method: "POST",
    headers: {
      "X-XSRF-TOKEN": csrfToken,
    },
  })
  if (!response.ok) {
    throw Error("Could not logout")
  }
}

const useLogout = (successCallBack: Function) => {
  const logoutMutation = useMutation({
    mutationFn: () => fetchUseLogout(),
    onError: (e: Error) => {
      console.error(e)
    },
    onSuccess: () => successCallBack(),
  })
  return logoutMutation
}

export default useLogout
