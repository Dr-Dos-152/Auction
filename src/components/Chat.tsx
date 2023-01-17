import { SpaceBetween } from '@cloudscape-design/components';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import moment from 'moment';
import { useState } from 'react';
import styles from "../styles/Chat.module.scss";

const Chat = (props: {
  userName: string, messages: Array<ChatMessageResponse>, publishMessage: (message: { destinationUserName: string; body: string }) => void,
}) => {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    props.publishMessage({
      destinationUserName: props.userName,
      body: message
    })
  }

  const messages = props.messages ? props.messages.map(message => <Message {...message} />) : "No messages";

  return (
    <div>
      <SpaceBetween size={'s'} direction="vertical">
        <div className={styles.chatbox}>
          {messages}
        </div>

        <div style={{
          display: 'flex',
          gap: "1rem"
        }}>
          <div style={{ width: "70%" }}>
            <Input value={message} onChange={(e) => setMessage(e.detail.value)} />
          </div>
          <Button onClick={() => handleClick()}>Send</Button>
        </div>
      </SpaceBetween>
    </div>
  )
}


const Message = (props: ChatMessageResponse) => {


  return (
    <div className={styles.message}>
      <span>
        {moment(props.dateTime).format('HH:mm:ss')}
      </span>
      <span className={styles.messageUserName}>
        {props.userName}:
      </span>
      <span className={styles.messageContent}>
        {props.message}
      </span>
    </div>
  )
}

export default Chat
