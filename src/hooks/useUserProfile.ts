import { useMutation, useQuery } from "react-query"

interface User {
  id: number
  username: string
  profile: Profile
}

interface Profile {
  id: number
  firstName: string
  lastName: string
  description: string
  profilePictureURL: string
}

const fetchUserDetails = async (userId: number) => {
  const response = await fetch(`http://localhost:8080/api/v1/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: "Basic dGVzdDp0ZXN0",
    },
  })
  if (!response.ok) {
    throw new Error("Could not fetch user details")
  }
  return await response.json()
}

const useUserDetails = (userId: number) => {
  const userDetailsQuery = useQuery<User, Error>("userDetails", () =>
    fetchUserDetails(userId)
  )
  return userDetailsQuery
}

export default useUserDetails
