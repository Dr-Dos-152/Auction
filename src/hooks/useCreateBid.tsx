import React, { useContext } from "react"
import { useMutation } from "react-query"
import { AlertContext } from "../App"
import { Spinner } from "@cloudscape-design/components"

interface BidCreateRequest {
  auctionId: string
  amount: number
  comment?: string
}

const fetchCreateBid = async (request: BidCreateRequest) => {
  const response = await fetch(
    `http://localhost:8080/api/v1/auction/${request.auctionId}/bid`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic dGVzdDp0ZXN0",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  )
  if (!response.ok) {
    throw Error(
      `Could not place a bid! Failed with status code: ${response.status} (${response.statusText})`
    )
  }
}

const useCreateBid = (args: { handleSuccess: Function }) => {
  const { setAlertNotification } = useContext(AlertContext)
  const createBidMutation = useMutation({
    mutationFn: (bidCreateRequest: BidCreateRequest) =>
      fetchCreateBid(bidCreateRequest),
    onError: (e) => {
      console.log(`An error occured: ${e}`)
      setAlertNotification({
        isVisible: true,
        type: "error",
        header: "Error placing a bid",
        content: "Couldn't place a bid. Please try again later.",
      })
    },
    onSuccess: (e) => {
      setAlertNotification({
        isVisible: true,
        type: "success",
        header: "Successfully placed a bid",
        content: "",
      })
      args.handleSuccess()
    },
    onMutate: () => {
      setAlertNotification({
        isVisible: true,
        type: "info",
        header: "Attempting to place a bid",
        content: <Spinner />,
      })
      args.handleSuccess()
    },
  })
  return createBidMutation
}

export default useCreateBid
