import { SpaceBetween } from "@cloudscape-design/components"
import Box from "@cloudscape-design/components/box"
import Button from "@cloudscape-design/components/button"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import Spinner from "@cloudscape-design/components/spinner"
import Table from "@cloudscape-design/components/table"
import React, { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { AlertContext } from "../App"
import useAuctionDetail, { ItemDetail } from "../hooks/useAuctionDetail"
import useBids, { Bid } from "../hooks/useBids"
import BidsTable from "./BidsTable"

const AuctionDetail = () => {
  const { auctionId } = useParams()
  const { setAlertNotification } = useContext(AlertContext)

  const {
    data: auctionData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useAuctionDetail(auctionId as string)

  useEffect(() => {
    if (isError) {
      setAlertNotification({
        isVisible: true,
        header: "Could not fetch Auction",
        content: `${error}`,
        type: "error",
      })
    }
  }, [isError])

  if (isLoading) {
    return <Spinner />
  }

  if (isError) {
    return <div>An error occurred</div>
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <Container
        header={
          <Header variant="h2" description={auctionData?.description}>
            {auctionData?.name}
          </Header>
        }
      >
        <Item {...auctionData!.item} />
      </Container>

      <div style={{ marginTop: "2rem" }}>
        <Bids auctionId={auctionId!} />
      </div>
    </div>
  )
}

const Bids = (props: { auctionId: string }) => {
  const { data: bidsData, isLoading, isError, error } = useBids(props.auctionId)

  if (isError) {
    return <div>Error loading bids</div>
  }

  return <BidsTable data={bidsData!} isLoading={isLoading} />
}

const Item = (props: ItemDetail) => {
  return (
    <div>
      <b>{props.name}</b>

      <p>{props.description}</p>
    </div>
  )
}

export default AuctionDetail
