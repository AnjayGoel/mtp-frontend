import ChatMessage, {ChatMessageProps} from "./ChatMessage";
import {Button, Card, Input} from "antd";
import {SendOutlined} from "@ant-design/icons";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {getUserInfo} from "../utils";
import {Commands} from "../constants";

export interface PlayerVideosProp {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  remoteAvatar: string
}

const PlayerVideos = ({localStream, remoteStream, remoteAvatar}: PlayerVideosProp) => {

  const localRef = useRef<HTMLVideoElement | null>(null)
  const remoteRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (localRef == null || localRef.current == null || localStream == null) return;
    localRef.current.srcObject = localStream
  }, [localStream])

  useEffect(() => {
    if (remoteRef == null || remoteRef.current == null || remoteStream == null) return;
    remoteRef.current.srcObject = remoteStream
  }, [remoteStream])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
        boxSizing: 'border-box'
      }}>
      <div style={{width: '60%', height: 'fit-content', padding: '2px'}}>
        <Card
          headStyle={{backgroundColor: '#1677ff', color: 'white'}}
          bodyStyle={{padding: '0px'}}
          size={"small"} title={"Other Person"}>
          <video
            height="auto"
            width="100%"
            ref={remoteRef}
            poster={remoteAvatar.replace("s96-c", "s512-c")}
            playsInline autoPlay/>
        </Card>
      </div>
      <div style={{width: '40%', height: 'fit-content', padding: '2px'}}>
        <Card
          headStyle={{backgroundColor: '#1677ff', color: 'white'}}
          bodyStyle={{padding: '0px'}}
          size={"small"} title={"You"}>
          <video
            height="auto"
            width="100%"
            ref={localRef}
            playsInline autoPlay/>
        </Card>
      </div>
    </div>
  )
}

export default PlayerVideos
