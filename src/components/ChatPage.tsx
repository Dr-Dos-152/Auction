import { Container, Grid } from "@cloudscape-design/components"
import { useContext, useEffect, useState } from "react";
import Chat from "./Chat"
import ChatUser from "./ChatUser"
import * as StompJs from '@stomp/stompjs';
import { AuthenticatedContext } from "../App";


interface MessageBody {
  userName: string
  message: string
}


const ChatPage = () => {
  const [client, setClient] = useState<StompJs.Client | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Array<String>>>({});
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
        const messageBody: MessageBody = JSON.parse(message.body);
        console.log('Received message', messageBody);
        setChatMessages((oldChatMessages) => {
          const messages = oldChatMessages[messageBody.userName] ? [...oldChatMessages[messageBody.userName]] : []
          messages.push(messageBody.message)
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

  const publishMessage = (message: { destination: string, body: string }) => {
    client!.publish(message);
  }

  return (
    <Container header={<h2>Chat</h2>}>
      <p>Chatting with: {selectedUser}</p>
      <Grid gridDefinition={[
        { colspan: { default: 12, s: 3 } },
        { colspan: { default: 12, s: 9 } },
      ]}>
        <div>
          <div onClick={() => setSelectedUser("shubdhi")}>
            <ChatUser name="shubdhi" />
          </div>
          <div onClick={() => setSelectedUser("bob")}>
            <ChatUser name="bob" />
          </div>
          <div onClick={() => setSelectedUser("test")}>
            <ChatUser name="test" />
          </div>
        </div>
        {selectedUser && <Chat userName={selectedUser} messages={chatMessages[selectedUser]} publishMessage={publishMessage} />}
      </Grid>
    </Container>
  )

}


export default ChatPage
