import { Button, Modal, SpaceBetween } from "@cloudscape-design/components"
import React, { useContext } from "react"
import { FlashbarContext } from "../App"
import useLogout from "../hooks/useLogout"

const Logout = (props: {
  setShowLogOutModal: React.Dispatch<React.SetStateAction<boolean>>
  showLogOutModal: boolean
  setUserIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const logoutMutation = useLogout(() => {
    props.setUserIsLoggedIn(false)

  })
  const { flashBarNotification, setFlashBarNotification } = useContext(FlashbarContext);

  const handleLogoutClick = () => {
    logoutMutation.mutate()
    props.setShowLogOutModal(false)
    const newFlashBarNotification = [...flashBarNotification]
    newFlashBarNotification.push(
      {
        header: "Logged out successfully",
        type: "success",
        content:
          "You have been logged out, bye!",
        dismissible: true,
        dismissLabel: "Dismiss message",
        onDismiss: () => {
          setFlashBarNotification(flashBarNotifications => {
            return flashBarNotifications.filter((flashBarNotification) => {
              return flashBarNotification.id !== "logoutNotification"
            })
          })
        },
        id: "logoutNotification"
      }
    )
    setFlashBarNotification(newFlashBarNotification);
  }

  return (
    <Modal
      onDismiss={() => props.setShowLogOutModal(false)}
      visible={props.showLogOutModal}
      header={"Logout"}
    >
      <p>Are you sure you want to logout?</p>

      <SpaceBetween direction="horizontal" size="xs">
        <Button variant="link" onClick={() => props.setShowLogOutModal(false)}>Cancel</Button>
        <Button variant="primary" onClick={handleLogoutClick}>
          Logout
        </Button>
      </SpaceBetween>
    </Modal>
  )
}

export default Logout
