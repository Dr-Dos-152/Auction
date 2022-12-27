import { useContext } from "react"
import { AlertContext } from "../App"
import { useMutation } from "react-query"

interface ProfileUpdateRequest {
  firstName?: string
  lastName?: string
  description?: string
  image?: File
}

const fetchUpdateProfile = async (
  profileUpdateRequest: ProfileUpdateRequest
) => {
  // api call here
}

const useUpdateProfile = () => {
  const { setAlertNotification } = useContext(AlertContext)
  const updateProfileMutation = useMutation({
    mutationFn: (profileUpdateRequest: ProfileUpdateRequest) =>
      fetchUpdateProfile(profileUpdateRequest),
  })
  return updateProfileMutation
}

export default useUpdateProfile
