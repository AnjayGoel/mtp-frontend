import ChatMessage, {ChatMessageProps} from "./ChatMessage";
import {Button, Input} from "antd";
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
    if (input === "") return;
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
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '10%',
          padding: '10px',
          borderRadius: '10px 10px 0 0',
          backgroundColor: '#1677ff',
          color: 'white',
          fontWeight: 'bold'
        }}>Chat
      </div>
      <div
        ref={chatBoxRef}
        style={{
          paddingBottom: '5px',
          overflowY: 'scroll',
          height: '80%',
          overflowX: 'clip'
        }}>{
        chats.map((it, _) => {
          return (
            <ChatMessage
              key={_}
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
    </div>
  )
}

export default ChatBox
