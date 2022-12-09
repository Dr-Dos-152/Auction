export interface Item {
  currentBid?: number
  startingPrice: number
}

const AuctionItem = (props: Item) => {
  return (
    <>
      <div>
        <div>Starting Price: {props.startingPrice}</div>
        <div>Current Bid: {props.currentBid ?? "No current bids"}</div>
      </div>
    </>
  )
}

export default AuctionItem
