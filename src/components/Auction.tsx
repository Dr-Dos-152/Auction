import React from "react"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import style from "../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"

interface Auction {
  name: string
  description: string
  item: Item
  closingTime: string
}

const Auction = (props: Auction) => {
  return (
    <div className={style.auctionCard}>
      <div style={{ padding: "1rem" }}>
        <Header variant="h3" description={props.description}>
          <div className={style.auctionCardHeader}>
            <img
              height={"100px"}
              width={"100px"}
              src="images/MichaelScott.png"
            />
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
