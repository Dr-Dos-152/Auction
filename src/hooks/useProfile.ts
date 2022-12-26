import { useQuery } from "react-query"

const fetchUserProfile = async () => {
  const response = await fetch("http://localhost:8080/api/v1/profile", {
    method: "GET",
    headers: {
      Authorization: "Basic dGVzdDp0ZXN0",
    },
  })
  if (!response.ok) {
    throw Error("Could not fetch profile")
  }
  const responseData = await response.json()
  return responseData
}

const useProfile = () => {
  const profileQueryResult = useQuery<Profile, Error>(
    "fetchProfile",
    () => fetchUserProfile(),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )
  return profileQueryResult
}

export default useProfile
