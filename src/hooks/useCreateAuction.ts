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
      }
    },
  }
}


export const createAuction = async (newAuction: {
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
