import { Container, Spinner } from "@cloudscape-design/components"
import useUserDetails from "../hooks/useUserProfile"
import style from "../styles/UserDetail.module.scss"

const UserDetail = () => {
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
  } = useUserDetails(1)

  if (isLoadingUser) {
    return <Spinner />
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
    </div>
  )
}

export default UserDetail
