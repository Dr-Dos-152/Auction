import React, { useContext, useEffect, useState } from "react"

import { useQuery } from "react-query"
import Spinner from "@cloudscape-design/components/spinner"
import moment from "moment"
import Auction from "../Auction"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import {
  Badge,
  Grid,
  Pagination,
  SpaceBetween,
} from "@cloudscape-design/components"
import { AlertContext } from "../../App"

const fetchAuctions = async (
  createdAtOrder: CreatedAtOrder,
  currentPageIndex: number
) => {
  const headers = {
    Authorization: "Basic dGVzdDp0ZXN0",
  }
  const result = await fetch(
    `http://localhost:8080/api/v1/auctions?pageNumber=${
      currentPageIndex - 1
    }&createdAtOrder=${createdAtOrder}`,
    {
      method: "GET",
      headers: headers,
    }
  )
  const data = await result.json()

  if (!result.ok) {
    throw Error("Failed with: " + data.message)
  }
  return data
}

const AuctionListings = () => {
  const [createdAtOrder, setCreatedAtOrder] = useState(CreatedAtOrder.LATEST)
  const [bidsOrder, setBidsOrder] = useState(BidsOrder.MOST)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)

  const { data, error, isError, isLoading, isSuccess, refetch } = useQuery<
    { auctions: Array<Auction>; numPages: number },
    Error
  >("queryAllAuctions", () => fetchAuctions(createdAtOrder, currentPageIndex), {
    retry: false,
    refetchOnWindowFocus: false,
  })
  const { setAlertNotification } = useContext(AlertContext)

  useEffect(() => {
    refetch()
  }, [currentPageIndex])

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

  useEffect(() => {
    refetch()
  }, [bidsOrder, createdAtOrder])

  if (isError) {
    return <b>Could not fetch the data</b>
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <div>
        <AuctionSelectionDropdown
          createdAtOrder={createdAtOrder}
          setCreatedAtOrder={setCreatedAtOrder}
          bidsOrder={bidsOrder}
          setBidsOrder={setBidsOrder}
        />
      </div>

      <div>
        <Pagination
          ariaLabels={{
            nextPageLabel: "Next page",
            previousPageLabel: "Previous page",
            pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
          }}
          pagesCount={data!.numPages}
          currentPageIndex={currentPageIndex}
          onChange={(e) => {
            setCurrentPageIndex(e.detail.currentPageIndex)
          }}
        />
      </div>

      <Grid
        gridDefinition={[
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
          { colspan: { default: 12, s: 6 } },
        ]}
      >
        {data!.auctions.map((auctionItem: any) => {
          return (
            <Auction
              key={auctionItem.id}
              {...auctionItem}
              closingTime={moment(auctionItem.closingTime).fromNow()}
            />
          )
        })}
      </Grid>
    </>
  )
}

enum CreatedAtOrder {
  LATEST = "asc",
  OLDEST = "desc",
}

enum BidsOrder {
  LEAST = "least",
  MOST = "most",
}

interface AuctionSelectionDropdownProps {
  createdAtOrder: CreatedAtOrder
  setCreatedAtOrder: React.SetStateAction<any>
  bidsOrder: BidsOrder
  setBidsOrder: React.SetStateAction<any>
}

const AuctionSelectionDropdown = (props: AuctionSelectionDropdownProps) => {
  return (
    <>
      <SpaceBetween size="l" direction="vertical">
        <SpaceBetween size={"l"} direction="horizontal">
          <ButtonDropdown
            items={[
              { text: "Latest", id: CreatedAtOrder.LATEST, disabled: false },
              { text: "Oldest", id: CreatedAtOrder.OLDEST, disabled: false },
            ]}
            onItemClick={(e) => {
              const selection = e.detail.id
              props.setCreatedAtOrder(selection as CreatedAtOrder)
            }}
          >
            Sort By Created
          </ButtonDropdown>
          <Badge
            color={
              props.createdAtOrder === CreatedAtOrder.LATEST ? "green" : "red"
            }
          >
            {props.createdAtOrder}
          </Badge>
        </SpaceBetween>

        <SpaceBetween size={"l"} direction="horizontal">
          <ButtonDropdown
            items={[
              { text: "Least", id: BidsOrder.LEAST, disabled: false },
              { text: "Most", id: BidsOrder.MOST, disabled: false },
            ]}
            onItemClick={(e) => {
              const selection = e.detail.id
              props.setBidsOrder(selection as BidsOrder)
            }}
          >
            Sort By Bids
          </ButtonDropdown>
          <Badge color={props.bidsOrder === BidsOrder.MOST ? "red" : "green"}>
            {props.bidsOrder}
          </Badge>
        </SpaceBetween>
      </SpaceBetween>
    </>
  )
}

export default AuctionListings
