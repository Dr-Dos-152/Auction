import React, { useContext, useEffect } from "react"

import { useQuery } from "react-query"
import Spinner from "@cloudscape-design/components/spinner"
import { AlertContext } from "./Home"
import moment from "moment"
import Auction from "../Auction"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"

const fetchAuctions = async () => {
  const headers = {
    Authorization: "Basic " + btoa("test:test"),
  }
  const result = await fetch("http://localhost:8080/api/v1/auctions", {
    method: "GET",
    headers: headers,
  })
  const data = await result.json()

  if (!result.ok) {
    throw Error("Failed with: " + data.message)
  }
  return data
}

const AuctionListings = () => {
  const { data, error, isError, isLoading, isSuccess } = useQuery<
    Array<Auction>,
    Error
  >("queryAllAuctions", fetchAuctions, {
    retry: false,
    refetchOnWindowFocus: false,
  })
  const { setAlertNotification } = useContext(AlertContext)

  useEffect(() => {
    if (isError) {
      setAlertNotification({
        header: "Error fetching Auctions",
        content: error.message,
        type: "error",
        isVisible: true,
      })
    }
  }, [isError])

  if (isError) {
    return <b>Could not fetch the data</b>
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div>
        <AuctionSelectionDropdown />
      </div>

      <div>
        {data!.map((auctionItem: any) => {
          return (
            <Auction
              key={auctionItem.id}
              {...auctionItem}
              closingTime={moment(auctionItem.closingTime).fromNow()}
            />
          )
        })}
      </div>
    </>
  )
}

const AuctionSelectionDropdown = () => {
  return (
    <>
      <ButtonDropdown
        items={[
          { text: "Latest", id: "rm", disabled: false },
          { text: "Oldest", id: "rm", disabled: false },
        ]}
      >
        Sort By Created
      </ButtonDropdown>

      <ButtonDropdown
        items={[
          { text: "Least", id: "rm", disabled: false },
          { text: "Most", id: "rm", disabled: false },
        ]}
      >
        Sort By Bids:
      </ButtonDropdown>
    </>
  )
}

export default AuctionListings
