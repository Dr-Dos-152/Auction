import { Button, Container, Spinner } from "@cloudscape-design/components"
import { useNavigate } from "react-router-dom"
import useUserDetails from "../hooks/useUserProfile"
import style from "../styles/UserDetail.module.scss"

const UserDetail = (props: { createdById: number }) => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useUserDetails(props.createdById)
  const navigate = useNavigate();

  const handleClickChatWithUser = () => {
    navigate(`/chat?userId=${props.createdById}`)
  }

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div>Error fetching user details...</div>
  }

  return (
    <div className={style.userDetailsContainer}>
      <h3>Placed By</h3>
      <img
        className={style.image}
        src={
          userData?.profile.profilePictureURL ?? "/images/profile-anonymous.jpg"
        }
      ></img>
      <b>{userData?.username}</b>
      <div className={style.fullName}>
        <p>{userData?.profile.firstName}</p>
        <p>{userData?.profile.lastName}</p>
      </div>
      <Button onClick={handleClickChatWithUser} variant="primary">Chat with user</Button>
    </div>
  )
}

export default UserDetail
