import React from "react"
import { useQuery } from "react-query"

const fetchBids = async (auctionId: string) => {
  const response = await fetch(
    `http://localhost:8080/api/v1/auction/${auctionId}/bids`,
    {
      method: "GET",
      headers: {
        Authorization: "Basic dGVzdDp0ZXN0",
      },
    }
  )
  const data = await response.json()
  if (!response.ok) {
    throw Error(data.message)
  }
  return data
}

export interface Bid {
  id: number
  placedAt: Date
  amount: number
  placedByUsername: string
}

const useBids = (auctionId: string) => {
  const { data, isLoading, isError, error } = useQuery<Array<Bid>, Error>(
    "fetchBids",
    () => fetchBids(auctionId),
    {
      refetchOnWindowFocus: false,
    }
  )

  return { data, isLoading, isError, error }
}

export default useBids