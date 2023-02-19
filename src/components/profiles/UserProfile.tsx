import Button from "@cloudscape-design/components/button";
import Spinner from "@cloudscape-design/components/spinner"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import useUserProfile from "../../hooks/useUserProfile"
import styles from "../../styles/UserProfile.module.scss";

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate();
  const { data: profileData, isLoading, isError, isSuccess, refetch } = useUserProfile(parseInt(userId!))

  const handleClickChatWithUser = () => {
    navigate(`/chat?userId=${userId}`)
  }

  useEffect(() => {
    refetch()
  }, [])

  if (isLoading) {
    return <Spinner size="large" />
  }

  if (isError) {
    return <p>Error loading user profile</p>
  }

  return (
    <div className={styles.profileContainer}>
      <div>
        <b>{profileData?.username}</b>
        <p>{profileData?.profile.firstName} {profileData?.profile.lastName}</p>
        <p>{profileData?.profile.description}</p>

        <img className={styles.profileImage} src={
          profileData?.profile.profilePictureURL ?? "/images/profile-anonymous.jpg"
        } />
      </div>
      <Button onClick={handleClickChatWithUser} variant="primary">Chat with user</Button>
    </div>
  )
}

export default UserProfile
