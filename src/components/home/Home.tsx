import Grid from "@cloudscape-design/components/grid"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import AuctionListings from "./AuctionListings"
import { Button } from "@cloudscape-design/components"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <>
      <div>
        <Grid
          gridDefinition={[
            { colspan: { s: 10, xxs: 12 } },
            { colspan: { s: 2, xxs: 12 } },
          ]}
        >
          <AuctionListings />
          <div>
            <Link to={"/create-listing"}>
              <Button variant="link">Create Listing</Button>
            </Link>
            <Link to={"/my-listings"}>
              <Button variant="link">My Listings</Button>
            </Link>
            <Link to={"/my-bids"}>
              <Button variant="link">My Bids</Button>
            </Link>
          </div>
        </Grid>
      </div>
    </>
  )
}

export default Home
