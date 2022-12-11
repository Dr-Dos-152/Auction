import { Auction } from "../schemas/auctionSchema"
import { Item } from "../schemas/itemSchema"

const constructAuctionBody = (
  auction: Auction,
  item: Item,
  categoryId: string
) => {
  return {
    ...auction,
    item: {
      ...item,
      category: {
        id: categoryId,
      },
    },
  }
}

export const createAuction = async (newAuction: {
  auction: Auction
  item: Item
  categoryId: string
  image?: File
}) => {
  const requestBody = JSON.stringify(
    constructAuctionBody(
      newAuction.auction,
      newAuction.item,
      newAuction.categoryId
    )
  )

  const formData = new FormData()
  if (newAuction.image) {
    formData.append("image", newAuction.image)
  }
  formData.append(
    "auction",
    new Blob([requestBody], {
      type: "application/json",
    })
  )

  const response = await fetch("http://localhost:8080/api/v1/auctions", {
    method: "POST",
    headers: {
      Authorization: "Basic dGVzdDp0ZXN0",
    },
    body: formData,
  })

  // If the response is not successful, throw an error
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  // Return the response data
  return await response.json()
}
