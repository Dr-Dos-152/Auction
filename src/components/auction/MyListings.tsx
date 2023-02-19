import Spinner from "@cloudscape-design/components/spinner";
import useMyAuctions from "../../hooks/useMyAuctions"
import Auction from "./Auction";




const MyListings = () => {
  const fetchMyAuctionsQuery = useMyAuctions();

  if (fetchMyAuctionsQuery.isLoading) {
    return <Spinner size='large' />
  }

  if (fetchMyAuctionsQuery.isError) {
    return <p>Failed to fetch your auctions</p>
  }

  if (fetchMyAuctionsQuery.data?.length === 0) {
    return <p>No listings found</p>
  }

  return (
    <div>
      <p>List of your created auctions:</p>
      {fetchMyAuctionsQuery.data?.map(auction => <Auction {...auction} />
      )}
    </div>
  )
}

export default MyListings
