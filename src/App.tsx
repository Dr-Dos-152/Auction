import React, { createContext, ReactNode, useEffect, useState } from "react"
import "./App.scss"
import "@cloudscape-design/global-styles/index.css"
import TopNavigation, { TopNavigationProps } from "@cloudscape-design/components/top-navigation"
import { AppLayout, ButtonDropdownProps, Flashbar, FlashbarProps } from "@cloudscape-design/components"
import Footer from "./components/Footer"
import "@cloudscape-design/global-styles/index.css"
import { QueryClient, QueryClientProvider } from "react-query"
import { Outlet, useNavigate } from "react-router-dom"
import Alert from "@cloudscape-design/components/alert"
import { noop } from "lodash"
import Logout from "./components/Logout"
import fetchVerifyCredentials from "./utils/authUtils"

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

interface AuthenticatedContextType {
  userIsLoggedIn: boolean
  setUserIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
}

export const AuthenticatedContext = createContext<AuthenticatedContextType>({
  userIsLoggedIn: false,
  setUserIsLoggedIn: noop
})

interface FlashbarContextType {
  flashBarNotification: Array<FlashbarProps.MessageDefinition>,
  setFlashBarNotification: React.Dispatch<React.SetStateAction<Array<FlashbarProps.MessageDefinition>>>
}

export const FlashbarContext = createContext<FlashbarContextType>({
  flashBarNotification: [],
  setFlashBarNotification: noop,
})


function App() {
  const [alertNotification, setAlertNotification] = useState<null | Alert>(null)
  const [flashBarNotification, setFlashBarNotification] = useState<Array<FlashbarProps.MessageDefinition>>([]);
  const [showLogOutModal, setShowLogOutModal] = useState(false)
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkIfUserIsLoggedIn() {
      const result = await fetchVerifyCredentials();
      setUserIsLoggedIn(result);
    }

    checkIfUserIsLoggedIn();
  }, [])

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

  const getNavigationUtilities = () => {
    const menuUtility: TopNavigationProps.Utility = {
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
    }

    const utilities: TopNavigationProps.Utility[] = [
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
    ]

    if (userIsLoggedIn) {
      utilities.push(menuUtility)
    } else {
      utilities.push({
        type: "button",
        iconName: "user-profile",
        ariaLabel: "Login",
        title: "Login",
        onClick: () => {
          navigate("/login")
        }
      })
    }
    return utilities;
  }

  return (
    <>
      <AuthenticatedContext.Provider value={{ userIsLoggedIn, setUserIsLoggedIn }}>
        <AlertContext.Provider
          value={{ alertNotification, setAlertNotification }}
        >
          <FlashbarContext.Provider value={{ flashBarNotification, setFlashBarNotification }}>
            <QueryClientProvider client={queryClient}>
              <TopNavigation
                identity={{
                  onFollow: (e) => {
                    e.preventDefault();
                    navigate("/");
                  },
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
                utilities={getNavigationUtilities()}
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
              {flashBarNotification.length !== 0 && (
                <div style={{ margin: "1rem 0.5rem 0 0.5rem", position: "fixed", bottom: "2.5rem", right: "1rem", zIndex: 1000 }}>
                  <Flashbar
                    items={flashBarNotification}
                  />
                </div>
              )}
              <Logout
                showLogOutModal={showLogOutModal}
                setShowLogOutModal={setShowLogOutModal}
                setUserIsLoggedIn={setUserIsLoggedIn}
              />
              <AppLayout
                footerSelector="#footer"
                navigationHide={true}
                toolsHide={true}
                content={<Outlet />}
              />
            </QueryClientProvider>
          </FlashbarContext.Provider>
        </AlertContext.Provider>
      </AuthenticatedContext.Provider>
      <Footer />
    </>
  )
}

export default App
