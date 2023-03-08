import { useQuery } from "react-query"

const fetchSearchAuctions = async (text: string) => {
  const result = await fetch(`/api/v1/auctions/search?query=${text}`)

  if (!result.ok) {
    throw Error("Failed to search auctions")
  }

  const data = await result.json()
  return data
}

const useSearchAuctions = (text: string) => {
  const fetchMyAuctionsQuery = useQuery<Array<Auction>, Error>(
    ["useSearchAuctions", text],
    () => fetchSearchAuctions(text)
  )
  return fetchMyAuctionsQuery
}

export default useSearchAuctions
