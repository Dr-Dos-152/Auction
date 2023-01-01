import { useMutation } from "react-query"

const fetchUseLogout = async () => {
  const response = await fetch("/logout", {
    method: "POST",
  })
  if (!response.ok) {
    throw Error("Could not logout")
  }
}

const useLogout = () => {
  const logoutMutation = useMutation({
    mutationFn: () => fetchUseLogout(),
    onError: (e: Error) => {
      console.error(e)
    },
  })
  return logoutMutation
}

export default useLogout
