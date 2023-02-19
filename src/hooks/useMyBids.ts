import { useQuery } from "react-query"

const fetchMyBids = async () => {
  const result = await fetch("/api/v1/myBids")
  if (!result.ok) {
    throw Error("Could not fetch your bids")
  }
  const data = await result.json()
  return data
}

const useMyBids = () => {
  const fetchMyBidsQuery = useQuery<Array<Bid>, Error>("myBids", () =>
    fetchMyBids()
  )
  return fetchMyBidsQuery
}

export default useMyBids
