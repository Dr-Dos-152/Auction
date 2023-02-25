import React, { useContext, useEffect, useState } from "react"

import { useQuery } from "react-query"
import Spinner from "@cloudscape-design/components/spinner"
import moment from "moment"
import Auction from "../auction/Auction"
import ButtonDropdown from "@cloudscape-design/components/button-dropdown"
import {
  Badge,
  Grid,
  Pagination,
  SpaceBetween,
} from "@cloudscape-design/components"
import { AlertContext } from "../../App"

const fetchAuctions = async (
  sortOrder: SortOrder,
  currentPageIndex: number
) => {
  const sortByColumn = sortOrder === SortOrder.BIDS_ORDER_LEAST || sortOrder === SortOrder.BIDS_ORDER_MOST ? "bids" : "createdAt";
  const sortOrderString = sortOrder === SortOrder.BIDS_ORDER_LEAST || sortOrder === SortOrder.CREATED_AT_LATEST ? "asc" : "desc";

  const result = await fetch(
    `/api/v1/auctions?pageNumber=${currentPageIndex - 1
    }&sortBy=${sortByColumn}&sortOrder=${sortOrderString}`,
    {
      method: "GET",
    }
  )
  const data = await result.json()

  if (!result.ok) {
    throw Error("Failed with: " + data.message)
  }
  return data
}

const AuctionListings = () => {
  const [sortOrder, setSortOrder] = useState(SortOrder.CREATED_AT_LATEST)
  const [currentPageIndex, setCurrentPageIndex] = useState(1)

  const { data, error, isError, isLoading, isSuccess, refetch } = useQuery<
    { auctions: Array<Auction>; numPages: number },
    Error
  >("queryAllAuctions", () => fetchAuctions(sortOrder, currentPageIndex), {
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
  }, [sortOrder])

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
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
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

enum SortOrder {
  CREATED_AT_LATEST = "Latest",
  CREATED_AT_OLDEST = "Oldest",
  BIDS_ORDER_LEAST = "Least Bids",
  BIDS_ORDER_MOST = "Most Bids",
}

interface AuctionSelectionDropdownProps {
  sortOrder: SortOrder
  setSortOrder: React.SetStateAction<any>
}

const AuctionSelectionDropdown = (props: AuctionSelectionDropdownProps) => {
  return (
    <>
      <SpaceBetween size="l" direction="vertical">
        <SpaceBetween size={"l"} direction="horizontal">
          <ButtonDropdown
            items={[
              { text: "Newest", id: SortOrder.CREATED_AT_LATEST, disabled: false },
              { text: "Oldest", id: SortOrder.CREATED_AT_OLDEST, disabled: false },
              { text: "Most bids", id: SortOrder.BIDS_ORDER_MOST, disabled: false },
              { text: "Least bids", id: SortOrder.BIDS_ORDER_LEAST, disabled: false },
            ]}
            onItemClick={(e) => {
              const selection = e.detail.id
              props.setSortOrder(selection as SortOrder)
            }}
          >
            Sort By
          </ButtonDropdown>

          <Badge
          >
            {props.sortOrder}
          </Badge>


        </SpaceBetween>
      </SpaceBetween>
    </>
  )
}

export default AuctionListings
