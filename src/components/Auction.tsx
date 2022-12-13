import React from "react"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import style from "../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"
import { useNavigate } from "react-router-dom"
import { auctionSchema } from "../schemas/auctionSchema"

interface Auction {
  id: string
  name: string
  description: string
  item: Item
  closingTime: string
  s3ImageURL?: string
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
        <Header variant="h3" description={props.description}>
          <div className={style.auctionCardHeader}>
            <div className={style.auctionCardImageContainer}>
              <img
                className={style.auctionCardImage}
                src={props.s3ImageURL || "/images/No-Image-Placeholder.svg"}
              />
            </div>

            <b>{props.name}</b>
          </div>
        </Header>
        <div>
          <AuctionItem {...props.item} />
          <div>Closes {props.closingTime}</div>
        </div>
      </div>
    </div>
  )
}

export default Auction
