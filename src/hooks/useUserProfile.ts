import { useMutation, useQuery } from "react-query"

interface Profile {
  id: number
  firstName: string
  lastName: string
  description: string
  profilePictureURL: string
}

const fetchUserDetails = async (userId: number | null) => {
  const response = await fetch(`/api/v1/user/${userId}`, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error("Could not fetch user details")
  }
  return await response.json()
}

const useUserDetails = (userId: number | null) => {
  const userDetailsQuery = useQuery<User, Error>(
    `userDetails-${userId}`,
    () => fetchUserDetails(userId),
    {
      enabled: !!userId,
    }
  )
  return userDetailsQuery
}

export default useUserDetails
