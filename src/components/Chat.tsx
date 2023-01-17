import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import { useState } from 'react';


const Chat = (props: { userName: String, messages: Array<String>, publishMessage: Function }) => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    props.publishMessage({ destination: `/app/chat/${props.userName}`, body: message })
  }


  const messages = props.messages ? props.messages.map(message => <p>{message}</p>) : "None"


  return (
    <div>
      <Input value={message} onChange={(e) => setMessage(e.detail.value)} />
      <Button onClick={() => handleClick()}>Publish</Button>
      {messages}
    </div>
  )
}

export default Chat
