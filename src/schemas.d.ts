interface Bid {
  id: string
  placedAt: string
  amount: number
  placedByUsername: string
  comment: string
}

interface Profile {
  id: string
  firstName: string
  lastName: string
  description: string | null
  profilePictureURL: string | null
}
