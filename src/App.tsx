import React, { createContext, ReactNode, useState } from "react"
import "./App.scss"
import "@cloudscape-design/global-styles/index.css"
import TopNavigation from "@cloudscape-design/components/top-navigation"
import { AppLayout, ButtonDropdownProps } from "@cloudscape-design/components"
import Footer from "./components/Footer"
import "@cloudscape-design/global-styles/index.css"
import { QueryClient, QueryClientProvider } from "react-query"
import { Outlet, useNavigate } from "react-router-dom"
import Alert from "@cloudscape-design/components/alert"
import { noop } from "lodash"
import Logout from "./components/Logout"

const queryClient = new QueryClient()

interface Alert {
  header: string
  content: ReactNode
  isVisible: boolean
  type: "error" | "success" | "info"
}

interface AlertContextType {
  alertNotification: Alert | null
  setAlertNotification: React.Dispatch<React.SetStateAction<Alert | null>>
}

export const AlertContext = createContext<AlertContextType>({
  alertNotification: null,
  setAlertNotification: noop,
})

function App() {
  const [alertNotification, setAlertNotification] = useState<null | Alert>(null)
  const [showLogOutModal, setShowLogOutModal] = useState(false)
  const navigate = useNavigate()

  const handleUserProfileClick = (
    e: CustomEvent<ButtonDropdownProps.ItemClickDetails>
  ) => {
    switch (e.detail.id) {
      case "logout":
        handleLogoutClick()
        break
      case "profile":
        navigate("/profile")
        break
      default:
        noop()
    }
  }

  const handleLogoutClick = () => {
    setShowLogOutModal(true)
  }

  return (
    <>
      <AlertContext.Provider
        value={{ alertNotification, setAlertNotification }}
      >
        <QueryClientProvider client={queryClient}>
          <TopNavigation
            identity={{
              href: "/",
              title: "YetAnotherAuctionApp",
              logo: {
                src: "/images/logo.png",
                alt: "Auction App",
              },
            }}
            i18nStrings={{
              searchIconAriaLabel: "Search",
              searchDismissIconAriaLabel: "Close search",
              overflowMenuTriggerText: "More",
              overflowMenuTitleText: "All",
              overflowMenuBackIconAriaLabel: "Back",
              overflowMenuDismissIconAriaLabel: "Close menu",
            }}
            utilities={[
              {
                type: "menu-dropdown",
                iconName: "menu",
                title: "Services",
                items: [
                  {
                    id: "create-listing",
                    text: "Create Listing",
                    href: "/create-listing",
                  },
                  {
                    id: "explore-listings",
                    text: "Explore Listings",
                    href: "/",
                  },
                ],
              },
              {
                type: "button",
                iconName: "notification",
                title: "Notifications",
                ariaLabel: "Notifications (unread)",
                badge: true,
                disableUtilityCollapse: false,
              },
              {
                type: "menu-dropdown",
                iconName: "settings",
                ariaLabel: "Settings",
                title: "Settings",
                items: [
                  {
                    id: "theme-settings",
                    text: "Change theme",
                  },
                ],
              },
              {
                type: "menu-dropdown",
                iconName: "user-profile",
                ariaLabel: "Account",
                title: "Account",
                items: [
                  {
                    id: "logout",
                    text: "Logout",
                  },
                  {
                    id: "profile",
                    text: "View/Edit Profile",
                  },
                ],
                onItemClick: (e) => handleUserProfileClick(e),
              },
            ]}
          />
          {alertNotification && (
            <div style={{ margin: "1rem 0.5rem 0 0.5rem" }}>
              <Alert
                onDismiss={() => setAlertNotification(null)}
                visible={alertNotification?.isVisible}
                dismissAriaLabel="Close alert"
                header={alertNotification.header}
                type={alertNotification.type}
                dismissible
              >
                {alertNotification.content}
              </Alert>
            </div>
          )}
          <Logout
            showLogOutModal={showLogOutModal}
            setShowLogOutModal={setShowLogOutModal}
          />
          <AppLayout
            footerSelector="#footer"
            navigationHide={true}
            toolsHide={true}
            content={<Outlet />}
          />
        </QueryClientProvider>
      </AlertContext.Provider>
      <Footer />
    </>
  )
}

export default App
