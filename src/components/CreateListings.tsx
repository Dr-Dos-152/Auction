import Button from "@cloudscape-design/components/button"
import Container from "@cloudscape-design/components/container"
import Form from "@cloudscape-design/components/form"
import FormField from "@cloudscape-design/components/form-field"
import Header from "@cloudscape-design/components/header"
import Input from "@cloudscape-design/components/input"
import Select, { SelectProps } from "@cloudscape-design/components/select"
import SpaceBetween from "@cloudscape-design/components/space-between"
import Textarea from "@cloudscape-design/components/textarea"
import { forOwn, map } from "lodash"
import { useContext, useState } from "react"
import { useMutation } from "react-query"
import { z } from "zod"
import { AlertContext } from "../App"
import { redirect, useNavigate } from "react-router-dom"

const auctionSchema = z.object({
  name: z.string().max(30).min(5).trim(),
  description: z.string().max(100).min(5).trim(),
  startingPrice: z.number().min(1),
})

type Auction = z.infer<typeof auctionSchema>

const itemSchema = z.object({
  name: z.string().max(30).min(10).trim(),
  description: z.string().max(100).min(10).trim(),
  categoryId: z.string().optional(),
})

type Item = z.infer<typeof itemSchema>

const constructAuctionBody = (
  auction: Auction,
  item: Item,
  categoryId: string
) => {
  return {
    ...auction,
    item: {
      ...item,
      categoryId,
    },
  }
}

const createAuction = async (newAuction: {
  auction: Auction
  item: Item
  categoryId: string
}) => {
  const response = await fetch("http://localhost:8080/api/v1/auctions", {
    method: "POST",
    body: JSON.stringify(
      constructAuctionBody(
        newAuction.auction,
        newAuction.item,
        newAuction.categoryId
      )
    ),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic dGVzdDp0ZXN0",
    },
  })

  // If the response is not successful, throw an error
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  // Return the response data
  return await response.json()
}

const CreateListing = () => {
  const navigate = useNavigate()

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([])

  const [category, setSelectedCategory] =
    useState<SelectProps.Option | null | null>(null)

  const [showCategoryError, setShowCategoryError] = useState(false)

  // Auction info
  const [auctionInfo, setAuctionInfo] = useState({
    name: "",
    description: "",
    startingPrice: 6.9,
  })
  const [auctionInfoErrors, setAuctionInfoErrors] = useState({
    name: "",
    description: "",
    startingPrice: "",
  })

  // Item info
  const [itemInfo, setItemInfo] = useState({
    name: "",
    description: "",
  })
  const [itemInfoErrors, setItemInfoErrors] = useState({
    name: "",
    description: "",
  })

  const { setAlertNotification } = useContext(AlertContext)

  const createAuctionMutation = useMutation({
    mutationFn: (newAuction: {
      auction: Auction
      item: Item
      categoryId: string
    }) => {
      return createAuction(newAuction)
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`An error`)
      setAlertNotification({
        isVisible: true,
        type: "error",
        header: "Error saving the listing",
        content: "Couldn't create an auction. Please try again later.",
      })
    },
    onSuccess: () => {
      setAlertNotification({
        type: "success",
        isVisible: true,
        header: "Successfull!",
        content: "You have listed an item",
      })
      setTimeout(() => {
        console.log("redirecting")
        navigate("/")
      }, 1500)
    },
  })

  const fetchAllCategories = async () => {
    const result = await fetch("http://localhost:8080/api/v1/categories", {
      method: "GET",
      headers: {
        Authorization: "Basic dGVzdDp0ZXN0",
      },
    })
    const data = await result.json()
    if (!result.ok) {
      throw Error(data.message)
    }
    const categories = map(data, (category) => {
      return {
        label: category.name,
        value: category.id,
      }
    })
    setCategories(categories)
  }

  const handleLoadCategoryOptions = () => {
    try {
      fetchAllCategories()
    } catch (e) {
      setAlertNotification({
        type: "error",
        header: "Error fetching categories",
        content: "Could not fetch categories of items",
        isVisible: true,
      })
    }
  }

  const handleAuctionInfoChange = (inputId: string, inputValue: string) => {
    setAuctionInfoErrors((prevAuctionInfoErrors) => {
      return {
        ...prevAuctionInfoErrors,
        [inputId]: "",
      }
    })
    setAuctionInfo((prevAuctionInfo) => {
      return {
        ...prevAuctionInfo,
        [inputId]: inputValue,
      }
    })
  }

  const handleItemInfoChange = (inputId: string, inputValue: string) => {
    setItemInfoErrors((prevItemInfoErrors) => {
      return {
        ...prevItemInfoErrors,
        [inputId]: "",
      }
    })

    setItemInfo((prevItemInfo) => {
      return {
        ...prevItemInfo,
        [inputId]: inputValue,
      }
    })
  }

  const handleClickSubmit = () => {
    const auctionResult = auctionSchema.safeParse(auctionInfo)
    const itemResult = itemSchema.safeParse(itemInfo)

    if (itemResult.success && auctionResult.success && category?.value) {
      const auctionData = auctionResult.data
      const itemData = itemResult.data
      createAuctionMutation.mutate({
        auction: auctionData,
        item: itemData,
        categoryId: category.value,
      })
      return
    }

    if (!auctionResult.success) {
      const errors = auctionResult.error.flatten()
      const fieldErrors = errors.fieldErrors
      forOwn(fieldErrors, (value, key) => {
        setAuctionInfoErrors((prevAuctionInfoErrors) => {
          return {
            ...prevAuctionInfoErrors,
            [key]: value,
          }
        })
      })
    }

    if (!itemResult.success) {
      const errors = itemResult.error.flatten()
      const fieldErrors = errors.fieldErrors
      forOwn(fieldErrors, (value, key) => {
        setItemInfoErrors((prevItemInfoErrors) => {
          return {
            ...prevItemInfoErrors,
            [key]: value,
          }
        })
      })
    }

    if (category === null) {
      setShowCategoryError(true)
    }
  }

  return (
    <div>
      <Form
        actions={
          <>
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button onClick={handleClickSubmit} variant="primary">
              Submit
            </Button>
          </>
        }
        header={<Header variant="h1">Create Listing</Header>}
      >
        <Container header={<Header variant="h2">Form container header</Header>}>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="Auction title" errorText={auctionInfoErrors.name}>
              <Input
                value={auctionInfo.name}
                onChange={(e) =>
                  handleAuctionInfoChange("name", e.detail.value)
                }
                placeholder={"Vintage furniture for sale..."}
              />
            </FormField>
            <FormField
              label="Auction description"
              errorText={auctionInfoErrors.description}
            >
              <Textarea
                value={auctionInfo.description}
                onChange={(e) =>
                  handleAuctionInfoChange("description", e.detail.value)
                }
                placeholder={"Selling rare victorian era chair..."}
              />
            </FormField>

            <FormField label="Item" errorText={itemInfoErrors.name}>
              <Input
                value={itemInfo.name}
                onChange={(e) => handleItemInfoChange("name", e.detail.value)}
                placeholder={"Vintage furniture for sale..."}
              />
            </FormField>
            <FormField
              label="Item specifications"
              errorText={itemInfoErrors.description}
            >
              <Textarea
                value={itemInfo.description}
                onChange={(e) =>
                  handleItemInfoChange("description", e.detail.value)
                }
                placeholder={"Selling rare victorian era chair..."}
              />
            </FormField>

            <Select
              errorText={"Error loading categories"}
              invalid={showCategoryError}
              options={categories}
              selectedOption={category}
              onChange={(e) => {
                setShowCategoryError(false)
                const selectedOption = e.detail.selectedOption
                setSelectedCategory(selectedOption)
              }}
              selectedAriaLabel="Selected"
              onLoadItems={handleLoadCategoryOptions}
              loadingText={"Loading Categories..."}
            />
          </SpaceBetween>
        </Container>
      </Form>
    </div>
  )
}

export default CreateListing
