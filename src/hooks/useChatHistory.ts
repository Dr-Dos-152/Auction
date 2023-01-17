import { useQuery } from "react-query"

const fetchChatHistory = async (
  withUser: string,
  pageNumber?: number
): Promise<Array<ChatMessageResponse>> => {
  const response = await fetch(
    `/api/v1/chatHistory/${withUser}?pageNumber=${pageNumber ?? 0}`
  )
  if (!response.ok) {
    throw Error("Could not fetch chat history")
  }
  const data = await response.json()
  return Promise.resolve(data.chatMessages)
}

// const useChatHistory = (withUser: string, pageNumber?: number) => {
//   // const chatHistoryQuery = useQuery<Array<ChatMessageResponse>, Error>(
//   //   "fetchChatHistory",
//   //   () => fetchChatHistory(withUser, pageNumber),
//   //   {
//   //     retry: false,
//   //     refetchOnReconnect: false,
//   //     refetchOnWindowFocus: false,
//   //   }
//   // )
//   return fetchChatHistory(withUser, pageNumber)
// }

export default fetchChatHistory