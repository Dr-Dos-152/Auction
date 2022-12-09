import React from "react"
import "./App.css"
import "@cloudscape-design/global-styles/index.css"
import Button from "@cloudscape-design/components/button"
import TopNavigation from "@cloudscape-design/components/top-navigation"
import { AppLayout } from "@cloudscape-design/components"
import Home from "./components/home/Home"
import Footer from "./components/Footer"
import "@cloudscape-design/global-styles/index.css"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query"

const queryClient = new QueryClient()

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TopNavigation
          identity={{
            href: "#",
            title: "YetAnotherAuctionApp",
            logo: {
              src: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNDNweCIgaGVpZ2h0PSIzMXB4IiB2aWV3Qm94PSIwIDAgNDMgMzEiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxyZWN0IGZpbGw9IiMyMzJmM2UiIHN0cm9rZT0iI2Q1ZGJkYiIgeD0iMC41IiB5PSIwLjUiIHdpZHRoPSI0MiIgaGVpZ2h0PSIzMCIgcng9IjIiPjwvcmVjdD4KICAgICAgICA8dGV4dCBmb250LWZhbWlseT0iQW1hem9uRW1iZXItUmVndWxhciwgQW1hem9uIEVtYmVyIiBmb250LXNpemU9IjEyIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHRzcGFuIHg9IjkiIHk9IjE5Ij5Mb2dvPC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPgo=",
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
                  id: "settings-org",
                  text: "Organizational settings",
                },
                {
                  id: "settings-project",
                  text: "Project settings",
                },
              ],
            },
          ]}
        />

        <AppLayout
          footerSelector="#footer"
          navigationHide={true}
          disableContentPaddings={true}
          toolsHide={true}
          content={<Home />}
        />
      </QueryClientProvider>
      <Footer />
    </>
  )
}

export default App
