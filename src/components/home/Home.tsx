import Alert from "@cloudscape-design/components/alert"
import Grid from "@cloudscape-design/components/grid"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import AuctionListings from "./AuctionListings"
import { noop } from "lodash"

interface AlertContextType {
  alertNotification: Alert | null
  setAlertNotification: React.Dispatch<React.SetStateAction<Alert | null>>
}

export const AlertContext = createContext<AlertContextType>({
  alertNotification: null,
  setAlertNotification: noop,
})

interface Alert {
  header: string
  content: ReactNode
  isVisible: boolean
  type: "error" | "success"
}

const Home = () => {
  const [alertNotification, setAlertNotification] = useState<null | Alert>(null)

  return (
    <>
      <AlertContext.Provider
        value={{ alertNotification, setAlertNotification }}
      >
        {alertNotification && (
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
        )}
        <div style={{ margin: "1rem 1rem 2.5rem 1rem" }}>
          <Grid
            gridDefinition={[
              { colspan: { s: 10, xxs: 12 } },
              { colspan: { s: 2, xxs: 12 } },
            ]}
          >
            <div style={{ margin: "0 5rem" }}>
              <AuctionListings />
            </div>
            <div>Side content</div>
          </Grid>
        </div>
      </AlertContext.Provider>
    </>
  )
}

export default Home
