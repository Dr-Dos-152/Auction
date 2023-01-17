import { Container, Grid } from "@cloudscape-design/components"
import { useState } from "react";
import Chat from "./Chat"
import ChatUser from "./ChatUser"



const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState<String | null>(null);

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
        </div>
        {selectedUser && <Chat userName={selectedUser} />}
      </Grid>
    </Container>
  )

}


export default ChatPage
