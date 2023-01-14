import { useMutation } from "react-query"
import fetchWrapper from "../utils/fetchWrapper"

interface UserDetails {
  userName: string
  password: string
  firstName: string
  lastName: string
}

const fetchUserRegister = async (userDetails: UserDetails) => {
  const response = await fetchWrapper("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userDetails,
    }),
  })

  if (!response.ok) {
    throw Error("Could not register")
  }
}

const useRegister = (args: { handleMutationSuccess: Function }) => {
  const registerMutation = useMutation({
    mutationFn: (userDetails: UserDetails) => fetchUserRegister(userDetails),
    onSuccess: () => {
      args.handleMutationSuccess()
    },
  })

  return registerMutation
}

export default useRegister
