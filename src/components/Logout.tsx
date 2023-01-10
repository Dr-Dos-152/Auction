import { Button, Modal, SpaceBetween } from "@cloudscape-design/components"
import React from "react"
import useLogout from "../hooks/useLogout"

const Logout = (props: {
  setShowLogOutModal: React.Dispatch<React.SetStateAction<boolean>>
  showLogOutModal: boolean
  setUserIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const logoutMutation = useLogout(() => {
    props.setUserIsLoggedIn(false)
  })

  const handleLogoutClick = () => {
    logoutMutation.mutate()
    props.setShowLogOutModal(false)
  }

  return (
    <Modal
      onDismiss={() => props.setShowLogOutModal(false)}
      visible={props.showLogOutModal}
      header={"Logout"}
    >
      <p>Are you sure you want to logout?</p>

      <SpaceBetween direction="horizontal" size="xs">
        <Button variant="link">Cancel</Button>
        <Button variant="primary" onClick={handleLogoutClick}>
          Logout
        </Button>
      </SpaceBetween>
    </Modal>
  )
}

export default Logout
