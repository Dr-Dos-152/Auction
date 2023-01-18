import useUserDetails from "../hooks/useUserProfile";

// TODO: Handle errors and load re-sized image
const ChatUser = (props: { name: string, userId: number }) => {
  const { data: userData, isLoading, isSuccess, isError } = useUserDetails(props.userId);

  const profilePicture = isSuccess ? <img height={"70px"} style={{ borderRadius: "50%" }} src={userData.profile.profilePictureURL}></img> : ""
  return (
    <div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center', alignItems: 'center' }}>
        <div>
          {profilePicture}
        </div>
        <p>
          {props.name}
        </p>
      </div>

      <hr />
    </div>
  )

}

export default ChatUser
