import React from "react"
import Header from "@cloudscape-design/components/header"
import style from "../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"
import { useNavigate } from "react-router-dom"

interface Auction {
  id: string
  name: string
  description: string
  item: Item
  closingTime: string
  s3ImageURL?: string
  currentHighestBid?: Bid
}

const Auction = (props: Auction) => {
  const navigate = useNavigate()

  const handleClickAuction = (auctionId: string) => {
    navigate(`/auction/${auctionId}`)
  }

  return (
    <div
      className={style.auctionCard}
      onClick={() => handleClickAuction(props.id)}
    >
      <div style={{ padding: "1rem" }}>
        <div className={style.auctionCardHeader}>
          <img
            className={style.auctionCardImage}
            src={props.s3ImageURL || "/images/No-Image-Placeholder.svg"}
          />

          <b>{props.name}</b>
        </div>

        <p>{props.description}</p>

        <div>
          <AuctionItem {...props.item} />
          <div className={style.currentHighestBid}>
            Highest Bid:{" "}
            <b className="price">${props?.currentHighestBid?.amount}</b>
          </div>
          <div className={style.closingDateText}>
            Closes {props.closingTime}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auction
