import { useQuery } from "react-query"

const fetchChatHistoryUsers = async () => {
  const response = await fetch(`/api/v1/chatHistoryUsers`)
  if (!response.ok) {
    throw Error("Could not fetch list of users")
  }
  const data = await response.json()
  return data
}

const useChatUsers = () => {
  const fetchChatUsersQuery = useQuery<Array<User>, Error>(
    "fetchChatUsers",
    () => {
      return fetchChatHistoryUsers()
    }
  )

  return fetchChatUsersQuery
}

export default useChatUsers
