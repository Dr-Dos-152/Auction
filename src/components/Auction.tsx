import React from "react"
import Container from "@cloudscape-design/components/container"
import Header from "@cloudscape-design/components/header"
import style from "../styles/AuctionListings.module.scss"
import AuctionItem, { Item } from "./AuctionItem"

interface Auction {
  title: string
  description: string
  item: Item
  closingTime: string
}

const Auction = (props: Auction) => {
  return (
    <div
      style={{
        marginTop: "1rem",
        marginBottom: "1.5rem",
      }}
    >
      <Container
        header={
          <Header variant="h3" description={props.description}>
            <div className={style.auctionCardHeader}>
              <img
                height={"100px"}
                width={"100px"}
                src="images/MichaelScott.png"
              />
              {props.title}
            </div>
          </Header>
        }
      >
        <div>
          <AuctionItem {...props.item} />
          <div>Closes {props.closingTime}</div>
        </div>
      </Container>
    </div>
  )
}

export default Auction
