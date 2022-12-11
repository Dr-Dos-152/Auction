import {
  Table,
  Box,
  SpaceBetween,
  Button,
  Header,
} from "@cloudscape-design/components"

const BidsTable = () => {
  return (
    <Table
      columnDefinitions={[
        {
          id: "placedBy",
          header: "Placed By",
          cell: (item) => item.placedBy,
          sortingField: "placedBy",
        },
        {
          id: "comments",
          header: "Comment",
          cell: (item) => item.comments,
          sortingField: "comments",
        },
        {
          id: "amount",
          header: "Amount",
          cell: (item) => <b style={{ color: "green" }}>${item.amount}</b>,
        },
      ]}
      items={[
        {
          placedBy: "shubdhi",
          comments: "I like it",
          amount: 101.42,
        },
      ]}
      loadingText="Loading bids"
      empty={
        <Box textAlign="center" color="inherit">
          <SpaceBetween size={"s"}>
            <b>No bids</b>
            <Button>Bid on Auction</Button>
          </SpaceBetween>
        </Box>
      }
      header={<Header>All Bids</Header>}
    />
  )
}

export default BidsTable
