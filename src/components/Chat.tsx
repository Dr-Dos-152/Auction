import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import * as StompJs from '@stomp/stompjs';
import { useEffect, useState } from 'react';


const Chat = (props: { userName: String }) => {
  const [client, setClient] = useState<StompJs.Client | null>(null)
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<String>>([])

  const handleClick = () => {
    client!.publish({ destination: `/app/chat/${props.userName}:test`, body: message })
  }

  useEffect(() => {
    setChatMessages([]);
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

      client.subscribe(`/topic/${props.userName}:test`, (message) => {
        console.log('Received message', message);
        setChatMessages((oldChatMessages) => {
          const chatMessages = [...oldChatMessages]
          chatMessages.push(message.body)
          return chatMessages
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
  }, [props.userName])


  const messages = chatMessages.map((message) => <p>{message}</p>)

  return (
    <div>
      Chat
      <Input value={message} onChange={(e) => setMessage(e.detail.value)} />
      <Button onClick={() => handleClick()}>Publish</Button>
      {messages}
    </div>
  )
}

export default Chat
