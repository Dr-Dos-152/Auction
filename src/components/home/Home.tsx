import { Button } from "@cloudscape-design/components"
import Grid from "@cloudscape-design/components/grid"
import { Link } from "react-router-dom"
import AuctionListings from "./AuctionListings"

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
          <div style={{ padding: "1rem" }}>
            <h3>Quick Actions</h3>
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
