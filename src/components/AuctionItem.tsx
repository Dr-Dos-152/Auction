import Badge from "@cloudscape-design/components/badge"

export interface Item {
  currentBid?: number
  startingPrice: number
  category: { id: string; name: string }
}

const AuctionItem = (props: Item) => {
  return (
    <>
      <div>
        <div>Starting Price: {props.startingPrice}</div>
        <div>Current Bid: {props.currentBid ?? "No current bids"}</div>
        <Badge color="grey">{props.category?.name}</Badge>
      </div>
    </>
  )
}

export default AuctionItem
