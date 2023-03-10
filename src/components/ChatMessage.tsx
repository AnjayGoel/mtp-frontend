import React from 'react';
import {Avatar, Col, Row, Typography} from "antd";
import {getUserInfo} from "../utils";
import {RobotOutlined, UserOutlined} from "@ant-design/icons";

const {Title, Paragraph, Text, Link} = Typography;

export interface ChatMessageProps {
  name: string,
  email: string,
  avatar: string
  message: string

}

const ChatMessage = ({name, email, avatar, message}: ChatMessageProps) => {

  let userAvatar: any = avatar
  let isSystem = email === "system"
  let isSelf = email === getUserInfo()["email"] || isSystem
  if (isSystem) {
    userAvatar = <RobotOutlined/>
  }
  if (!isSelf) {
    userAvatar = <UserOutlined/>
  }

  return (
    <div style={{
      margin: '5px',
      boxSizing: 'border-box',
      borderRadius: '5px',
      backgroundColor: isSelf ? '#1677ff' : '#f1f1f1',
      color: isSelf ? 'white' : 'black'
    }}>
      <Row style={{height: 'fit-content'}} gutter={12}>
        <Col span={2}>
          <Avatar style={{marginTop: '5px', marginLeft: '5px'}} src={userAvatar}/>
        </Col>
        <Col style={{
          height: 'fit-content',
          marginLeft: '5px',
          paddingBottom: '5px'
        }} span={21}>
          {isSystem && (<Text style={{color: 'white'}} strong>System</Text>)}
          {!isSystem && (
            <Text style={{color: isSelf ? 'white' : 'black'}} strong>{isSelf ? "You" : "Other Person"}</Text>
          )}
          <br/>
          <div style={{wordWrap: 'break-word'}}>{message}</div>
        </Col>
      </Row>
    </div>
  )
};

export default ChatMessage;
