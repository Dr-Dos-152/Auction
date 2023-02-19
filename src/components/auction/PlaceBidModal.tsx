import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  FormField,
  Input,
  Spinner,
} from "@cloudscape-design/components"
import { forOwn } from "lodash"
import React, { useContext, useState } from "react"
import { Form } from "react-router-dom"
import { z } from "zod"
import { FlashbarContext } from "../../App"
import useCreateBid from "../../hooks/useCreateBid"

interface PlaceBidModalProps {
  setShowPlaceBidModal: React.Dispatch<React.SetStateAction<boolean>>
  showPlaceBidModal: boolean
  auctionId: string
  refetchBidsData: Function
}

const placeBidRequestSchema = z.object({
  amount: z.preprocess((arg) => Number(arg), z.number().min(1)),
  comment: z.string().min(0).max(100),
})

const PlaceBidModal = (props: PlaceBidModalProps) => {
  const [amount, setAmount] = useState("1.0")
  const [comment, setComment] = useState("")
  const [errors, setErrors] = useState({
    amount: "",
    comment: "",
  })
  const { flashBarNotification, setFlashBarNotification } = useContext(FlashbarContext);

  const handleMutationSuccess = () => {
    props.refetchBidsData()
    const newFlashBarNotification = [...flashBarNotification]
    newFlashBarNotification.push({
      header: "Placed bid",
      type: "success",
      content:
        `You have successfully placed a bid for $${amount}!`,
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => {
        setFlashBarNotification(flashBarNotifications => {
          return flashBarNotifications.filter((flashBarNotification) => {
            return flashBarNotification.id !== "placeBidNotification"
          })
        })
      },
      id: "placeBidNotification"
    })
    setFlashBarNotification(newFlashBarNotification);
  }

  const handleMutate = () => {
    const newFlashBarNotification = [...flashBarNotification]
    newFlashBarNotification.push({
      header: "Placing bid...",
      type: "info",
      content: <Spinner />,
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => {
        setFlashBarNotification(flashBarNotifications => {
          return flashBarNotifications.filter((flashBarNotification) => {
            return flashBarNotification.id !== "placeBidNotification"
          })
        })
      },
      id: "placeBidNotification"
    })

    props.setShowPlaceBidModal(false)
    setFlashBarNotification(newFlashBarNotification);
  }

  const handleError = () => {
    const newFlashBarNotification = [...flashBarNotification]
    newFlashBarNotification.push({
      header: "Error placing the bid",
      type: "error",
      content: "Please try again later",
      dismissible: true,
      dismissLabel: "Dismiss message",
      onDismiss: () => {
        setFlashBarNotification(flashBarNotifications => {
          return flashBarNotifications.filter((flashBarNotification) => {
            return flashBarNotification.id !== "placeBidNotification"
          })
        })
      },
      id: "placeBidNotification"
    })

    setFlashBarNotification(newFlashBarNotification);
  }

  const createBidMutation = useCreateBid({
    handleSuccess: handleMutationSuccess,
    handleMutate: handleMutate,
    handleError: handleError,
  })

  const clearErrorForId = (id: string) => {
    setErrors((prevErrors) => {
      return {
        ...prevErrors,
        [id]: "",
      }
    })
  }

  const handleClickSubmit = () => {
    const placeBidRequest = {
      amount: amount,
      comment: comment,
    }
    const placeBidRequestValidation =
      placeBidRequestSchema.safeParse(placeBidRequest)

    if (placeBidRequestValidation.success) {
      createBidMutation.mutate({
        auctionId: props.auctionId,
        ...placeBidRequestValidation.data,
      })
      return
    }

    const errors = placeBidRequestValidation.error.flatten()
    const fieldErrors = errors.fieldErrors
    forOwn(fieldErrors, (value, key) => {
      setErrors((prevErrors) => {
        return {
          ...prevErrors,
          [key]: value,
        }
      })
    })
  }

  return (
    <Modal
      onDismiss={() => props.setShowPlaceBidModal(false)}
      visible={props.showPlaceBidModal}
      closeAriaLabel="Close modal"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              onClick={() => props.setShowPlaceBidModal(false)}
              variant="link"
            >
              Cancel
            </Button>
            <Button onClick={() => handleClickSubmit()} variant="primary">
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="Place Bid"
    >
      <SpaceBetween size={"xl"}>
        <div>Fill in the details below to place a bid!</div>
        <Form>
          <FormField errorText={errors.amount} label="Amount">
            <Input
              value={amount}
              onChange={(e) => {
                clearErrorForId("amount")
                setAmount(e.detail.value)
              }}
            />
          </FormField>
          <FormField
            label="Comment"
            description="Optionally add a comment with bid"
            errorText={errors.comment}
          >
            <Input
              value={comment}
              onChange={(e) => {
                clearErrorForId("comment")
                setComment(e.detail.value)
              }}
              placeholder={"I would really like to buy this..."}
            />
          </FormField>
        </Form>
      </SpaceBetween>
    </Modal>
  )
}

export default PlaceBidModal
