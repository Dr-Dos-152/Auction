import React, { useContext } from "react"
import { useMutation } from "react-query"
import { AlertContext } from "../App"
import { Spinner } from "@cloudscape-design/components"
import { StatusCodes } from "http-status-codes"
import fetchWrapper from "../utils/fetchWrapper"

interface BidCreateRequest {
  auctionId: string
  amount: number
  comment?: string
}

const fetchCreateBid = async (request: BidCreateRequest) => {
  const response = await fetchWrapper(`/api/v1/auction/${request.auctionId}/bid`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })
  if (response.status === StatusCodes.BAD_REQUEST) {
    const responseData = await response.json()
    throw Error(
      `Could not place a bid. Reason: ${responseData.message ?? "Unknown"}`
    )
  }
  if (!response.ok) {
    throw Error(`Could not place a bid`)
  }
}

const useCreateBid = (args: { handleSuccess: Function, handleMutate: Function, handleError: Function }) => {
  const createBidMutation = useMutation({
    mutationFn: (bidCreateRequest: BidCreateRequest) =>
      fetchCreateBid(bidCreateRequest),
    onError: (e: Error) => {
      console.error(`An error occured: ${e}`)
      args.handleError()
    },
    onSuccess: () => {
      args.handleSuccess()
    },
    onMutate: () => {
      args.handleMutate()
    },
  })
  return createBidMutation
}

export default useCreateBid
