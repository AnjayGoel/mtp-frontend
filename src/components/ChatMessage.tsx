import React, {useEffect, useState} from 'react';
import {CredentialResponse, GoogleLogin} from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import {Avatar, Card, Col, notification, Row, Typography} from "antd";
import {checkSignedUp} from "../api";
import {useQuery} from "react-query";
import {getUseQueryOptions, getUserInfo} from "../utils";
import exp from "constants";
import {DeleteRowOutlined} from "@ant-design/icons";

const {Title, Paragraph, Text, Link} = Typography;

export interface ChatMessageProps {
  name: string,
  email: string,
  avatar: string
  message: string

}

const ChatMessage = ({name, email, avatar, message}: ChatMessageProps) => {

  let isUser = email === getUserInfo()["email"]

  return (
    <div style={{
      margin: '5px',
      boxSizing:'border-box',
      borderRadius: '5px',
      backgroundColor: 'white'}}>
      <Row style={{height: 'fit-content'}} gutter={12}>
        <Col span={2}>
          <Avatar style={{marginTop: '5px', marginLeft: '5px'}} src={avatar}/>
        </Col>
        <Col style={{height: 'fit-content', marginLeft: '5px', paddingBottom:'5px'}} span={21}>
          <Text strong>{isUser ? "You" : name}</Text>
          <br/>
          <div style={{wordWrap:'break-word'}}>{message}</div>
        </Col>
      </Row>
    </div>
  )
};

export default ChatMessage;
