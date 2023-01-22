import { Button, Container, Grid, Icon, Input, SpaceBetween, Spinner } from "@cloudscape-design/components"
import { useContext, useEffect, useState } from "react";
import Chat from "./Chat"
import ChatUser from "./ChatUser"
import * as StompJs from '@stomp/stompjs';
import { AuthenticatedContext } from "../App";
import moment from "moment";
import styles from "../styles/ChatPage.module.scss";
import useChatUsers from "../hooks/useFetchChatUsers";


const ChatPage = () => {
  const [client, setClient] = useState<StompJs.Client | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<ChatMessageResponse>>>({});
  const { userName } = useContext(AuthenticatedContext);

  useEffect(() => {
    setChatMessages({});
    const client = new StompJs.Client({
      brokerURL: 'ws://localhost:8081/websockets/stomp',
      connectHeaders: {
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      console.log("Connected")

      client.subscribe(`/topic/${userName}`, (message) => {
        const messageBody: ChatMessageResponse = JSON.parse(message.body);
        console.log('Received message', messageBody);
        setChatMessages((oldChatMessages) => {
          const messages = oldChatMessages[messageBody.userName] ? [...oldChatMessages[messageBody.userName]] : []
          messages.push(messageBody)
          return {
            ...oldChatMessages,
            [messageBody.userName]: messages
          }
        });
      })
    };

    client.onStompError = function (frame) {
      // Will be invoked in case of error encountered at Broker
      // Bad login/passcode typically will cause an error
      // Complaint brokers will set `message` header with a brief message. Body may contain details.
      // Compliant brokers will terminate the connection after any error
      console.log('Broker reported error: ' + frame.headers['message']);
      console.log('Additional details: ' + frame.body);
    };



    client.activate()
    setClient(client)

    return () => {
      client.deactivate()
    }
  }, [])

  const publishMessage = (message: { destinationUserName: string, body: string }) => {
    client!.publish({ destination: `/app/chat/${message.destinationUserName}`, body: message.body });
    setChatMessages((oldChatMessages) => {
      const messages = oldChatMessages[message.destinationUserName] ? [...oldChatMessages[message.destinationUserName]] : []
      messages.push({
        userName: userName,
        message: message.body,
        sentAt: moment.utc().format(),
      })
      return {
        ...oldChatMessages,
        [message.destinationUserName]: messages
      }
    });
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: 'center',
      height: "100%"
    }}>
      <div style={{ width: "100%" }}>
        <Container header={<h2>Chat</h2>}>
          <Grid gridDefinition={[
            { colspan: { default: 12, s: 3 } },
            { colspan: { default: 12, s: 9 } },
          ]}>
            <ChatUsersList setSelectedUser={setSelectedUser} />
            {selectedUser ?
              <div>
                <p>Chatting with: <b>{selectedUser}</b></p>
                {selectedUser && <Chat key={selectedUser} userName={selectedUser} messages={chatMessages[selectedUser]} publishMessage={publishMessage} />}
              </div> :
              <div>
                <p>It's lonely here! Select a user to chat with.</p>
              </div>
            }
          </Grid>
        </Container>
      </div>
    </div>
  )

}

const ChatUsersList = (props: { setSelectedUser: React.Dispatch<React.SetStateAction<string | null>> }) => {
  const chatUsersQuery = useChatUsers();
  const [chatUsersFilter, setChatUsersFilter] = useState("");

  if (chatUsersQuery.isLoading) {
    return (
      <Spinner />
    )
  }

  if (chatUsersQuery.isError) {
    return (
      <p>Error loading list of users</p>
    )
  }


  return (
    <div>
      <SpaceBetween size={"s"} direction="vertical">
        <div className={styles.chatUsers}>
          {
            chatUsersQuery.data?.filter(user => chatUsersFilter === ""
              || user.username.toLocaleLowerCase().startsWith(chatUsersFilter.toLowerCase()))
              .map(user => {
                return (<div className={styles.chatUserContainer} onClick={() => props.setSelectedUser(user.username)}>
                  <ChatUser name={user.username} userId={user.id} />
                </div>)
              })}
        </div>
        <SearchChatUserInput setChatUsersFilter={setChatUsersFilter} />
      </SpaceBetween>
    </div>
  )
}

// TODO: Debounce if needed
const SearchChatUserInput = (props: { setChatUsersFilter: React.Dispatch<React.SetStateAction<string>> }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (value: string) => {
    setValue(value)
    if (value.trim().length !== 0) {
      props.setChatUsersFilter(value)
    } else {
      props.setChatUsersFilter("")
    }
  }

  return (
    <>
      <Input placeholder="Search a user..." value={value} onChange={(e) => handleInputChange(e.detail.value)} />
    </>
  )
}

export default ChatPage
