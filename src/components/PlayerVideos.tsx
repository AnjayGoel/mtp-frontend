import {Card} from "antd";
import React, {useEffect, useRef} from "react";
import {getUserInfo} from "../utils";

export interface PlayerVideosProp {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  remoteAvatar: string,

  imageCallback: Function | null

  imageTrigger: number
}

const PlayerVideos = ({localStream, remoteStream, remoteAvatar, imageCallback, imageTrigger}: PlayerVideosProp) => {

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


  const sendImage = () => {
    console.log("send image: " + Date.now() / 1000)
    if (imageCallback == null) return;
    let canvas = document.createElement('canvas')
    canvas.width = 480
    canvas.height = 320
    let ctx = canvas.getContext('2d')
    ctx!.drawImage(localRef.current!!, 0, 0, canvas.width, canvas.height)
    imageCallback(canvas.toDataURL('image/jpeg'))
  }

  useEffect(() => {
    sendImage()
  }, [imageTrigger])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
        boxSizing: 'border-box',
        overflow: 'scroll'
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
            id='localVideo'
            height="auto"
            width="100%"
            ref={localRef}
            poster={getUserInfo()['picture'].replace("s96-c", "s512-c")}
            playsInline autoPlay/>
        </Card>
      </div>
    </div>
  )
}

export default PlayerVideos
