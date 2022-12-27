import { Grid, SpaceBetween } from "@cloudscape-design/components"
import Button from "@cloudscape-design/components/button"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import Spinner from "@cloudscape-design/components/spinner"
import React, { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AlertContext } from "../App"
import useAuctionDetail, { ItemDetail } from "../hooks/useAuctionDetail"
import useBids, { Bid } from "../hooks/useBids"
import BidsTable from "./BidsTable"
import PlaceBidModal from "./PlaceBidModal"
import useUserDetails from "../hooks/useUserProfile"
import UserDetail from "./UserDetail"

const AuctionDetail = () => {
  const { auctionId } = useParams()
  const { setAlertNotification } = useContext(AlertContext)

  const {
    data: auctionData,
    isLoading: isLoadingAuction,
    isError: isErrorAuction,
    error: auctionError,
  } = useAuctionDetail(auctionId as string)

  useEffect(() => {
    if (isErrorAuction) {
      setAlertNotification({
        isVisible: true,
        header: "Could not fetch Auction",
        content: `${auctionError}`,
        type: "error",
      })
    }
  }, [isErrorAuction])

  if (isLoadingAuction) {
    return <Spinner />
  }

  if (isErrorAuction) {
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
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 9 } },
            { colspan: { default: 12, s: 3 } },
          ]}
        >
          <div>
            <img
              height={"250px"}
              src={
                auctionData?.s3ImageURL || "/images/No-Image-Placeholder.svg"
              }
            />{" "}
            <Item {...auctionData!.item} />
          </div>

          <UserDetail />
        </Grid>
      </Container>

      <div style={{ marginTop: "2rem" }}>
        <Bids auctionId={auctionId!} />
      </div>
    </div>
  )
}

const Bids = (props: { auctionId: string }) => {
  const {
    data: bidsData,
    isLoading,
    isError,
    refetch,
  } = useBids(props.auctionId)
  const [showPlaceBidModal, setShowPlaceBidModal] = useState(false)

  if (isError) {
    return <div>Error loading bids</div>
  }

  return (
    <>
      {showPlaceBidModal && (
        <PlaceBidModal
          showPlaceBidModal={showPlaceBidModal}
          setShowPlaceBidModal={setShowPlaceBidModal}
          auctionId={props.auctionId}
          refetchBidsData={refetch}
        />
      )}
      <SpaceBetween size={"l"}>
        <BidsTable data={bidsData!} isLoading={isLoading} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button variant="primary" onClick={(e) => setShowPlaceBidModal(true)}>
            Place a bid
          </Button>
        </div>
      </SpaceBetween>
    </>
  )
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
