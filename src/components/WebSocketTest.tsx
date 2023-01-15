import * as StompJs from '@stomp/stompjs';


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

client.onConnect = function (frame) {
  console.log("Connected")
  console.log(frame)
  // Do something, all subscribes must be done is this callback
  // This is needed because this will be executed after a (re)connect

  client.subscribe("/topic/shubdhi:test", (message) => {
    console.log('Received message', message);
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

const WebSocketTest = () => {
  console.log(client);

  const handleClick = () => {
    console.log("Publishing...")
    client.publish({ destination: '/app/shubdhi:test', body: 'Hello world' })
  }

  return (
    <div>
      Hello, world!
      <button onClick={() => handleClick()}>Publish</button>
    </div>
  )
}

export default WebSocketTest
