import useUserDetails from "../hooks/useUserProfile";

// TODO: Handle errors and load re-sized image
const ChatUser = (props: { name: string, userId: number }) => {
  const { data: userData, isLoading, isSuccess, isError } = useUserDetails(props.userId);

  const profilePicture = isSuccess ? <img height={"70px"} style={{ borderRadius: "50%" }} src={userData.profile.profilePictureURL ?? "/images/profile-anonymous.jpg"}></img> : ""
  return (
    <div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          {profilePicture}
        </div>
        <p style={{ margin: "0" }}>
          {props.name}
        </p>
      </div>

      <hr />
    </div>
  )

}

export default ChatUser
