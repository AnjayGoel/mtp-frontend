import React, {useEffect, useState} from 'react';
import {Button, Col, Input, List, Row} from "antd";
import useWebSocket from "react-use-websocket";
import ChatMessage, {ChatMessageProps} from "../components/ChatMessage";
import exp from "constants";
import {getUserInfo} from "../utils";
import {SendOutlined} from "@ant-design/icons";

enum Commands {
  GAME_START = "GAME_START",
  GAME_UPDATE = "GAME_UPDATE",
  CHAT = "CHAT",
  PLAYER_DISCONNECT = "PLAYER_DISCONNECT",
}

export const Game = () => {
  const [socketUrl, setSocketUrl] = useState(process.env["REACT_APP_WS_URL"] as string);
  const [chats, setChats] = useState<ChatMessageProps[]>([]);
  const {sendMessage, lastMessage, readyState} = useWebSocket(socketUrl, {
    share: true,
    queryParams: {'token': localStorage.getItem('token')!!}
  });

  const handleWebsocketMessage = (message: MessageEvent) => {
    let messageJSON = JSON.parse(message.data)
    console.log(messageJSON)
    console.log("----")
    if (messageJSON["event"] === Commands.CHAT) {
      setChats(chats.concat(messageJSON["data"]));
    }
  }


  const [input, setInput] = useState('')
  useEffect(() => {
    console.log(lastMessage)
    if (lastMessage !== null) {
      handleWebsocketMessage(lastMessage)
    }
  }, [lastMessage, setChats]);


  const onChatInput = () => {
    let userInfo = getUserInfo()
    sendMessage(
      JSON.stringify({
        event: Commands.CHAT,
        data: {
          message: input,
          name: userInfo['name'],
          email: userInfo['email'],
          avatar: userInfo['picture']
        }
      }))
    setInput("")
  }
  return (
    <Row style={{width: '100%', height: '100%', padding: '10px'}}>
      <Col span={16}></Col>
      <Col span={8}>
        <div style={{backgroundColor: '#f1f1f1'}}>
          <List style={{
            height: '40vh',
            overflowY: 'scroll',
            overflowX: 'clip',
            marginBottom: '5px'
          }}>{
            chats.map(it => {
              return (
                <ChatMessage
                  name={it.name}
                  email={it.email}
                  avatar={it.avatar}
                  message={it.message}
                />
              )
            })}
          </List>
          <Input.Group compact>
            <Input style={{width: '90%'}}
                   value={input}
                   onKeyPress={(event) => {
                     console.log(event.key)
                     if (event.key === 'Enter') {
                       onChatInput()
                     }
                   }}
                   onChange={(event) => setInput(event.target.value)}/>
            <Button style={{width: '10%'}} type="primary" onClick={onChatInput}>
              <SendOutlined/>
            </Button>
          </Input.Group>
        </div>
      </Col>
    </Row>)

}
