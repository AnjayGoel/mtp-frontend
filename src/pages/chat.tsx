import React, {useEffect, useState} from 'react';
import {w3cwebsocket as W3CWebSocket} from "websocket";
import {Simulate} from "react-dom/test-utils";
import {Button, Col, Input, List, Row} from "antd";
import useWebSocket from "react-use-websocket";

export const Chat = () => {
  const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:8000/ws/chat/test/');
  const [messages, setMessages] = useState<any[]>([]);

  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl);
  const [input, setInput] = useState('')
  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage)
      setMessages(messages.concat(JSON.parse(lastMessage.data)));
    }
  }, [lastMessage, setMessages]);


  return (
    <div>
      <List>{messages.map(it => {
        return (
          <List.Item>
            {it.message}|
            {it.sender}
          </List.Item>
        )
      })}</List>
      <Input.Group compact>
        <Input value={input} onChange={(event) => setInput(event.target.value)}/>
        <Button type="primary" onClick={() => {
          sendMessage(
            JSON.stringify({
              message: input,
              sender: "anjay",
            }))
          setInput("")
        }}>
          Submit
        </Button>
      </Input.Group>

    </div>)

}
