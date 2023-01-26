import ChatMessage, {ChatMessageProps} from "./ChatMessage";
import {Button, Card, Input} from "antd";
import {SendOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";
import {getUserInfo} from "../utils";
import {Commands} from "../constants";

export interface ChatBoxProps {
  chats: ChatMessageProps[]
  sendMessage: Function
}

const ChatBox = ({chats, sendMessage}: ChatBoxProps) => {
  const [input, setInput] = useState('')
  const chatBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (chatBoxRef?.current !== null) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [chats])

  const onChatInput = () => {
    let userInfo = getUserInfo()
    sendMessage(
      JSON.stringify({
        type: Commands.CHAT,
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
    <Card
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f1f1f1',
        boxSizing: 'border-box',
      }}
      headStyle={{backgroundColor: '#1677ff', color: 'white'}}
      title="Chat" size={"small"} bordered={false}
    >
      <div
        ref={chatBoxRef}
        style={{
          paddingBottom: '5px',
          overflowY: 'scroll',
          height: '90%'
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
      </div>
      <Input.Group compact style={{height: '10%'}}>
        <Input style={{width: '90%', boxSizing: 'border-box',}}
               value={input}
               onKeyPress={(event) => {
                 if (event.key === 'Enter') {
                   onChatInput()
                 }
               }}
               onChange={(event) => setInput(event.target.value)}/>
        <Button style={{width: '10%'}} type="primary" onClick={onChatInput}>
          <SendOutlined/>
        </Button>
      </Input.Group>
    </Card>
  )
}

export default ChatBox
