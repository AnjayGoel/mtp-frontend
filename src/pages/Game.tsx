import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Input, List, notification, Row, Spin} from "antd";
import useWebSocket from "react-use-websocket";
import ChatMessage, {ChatMessageProps} from "../components/ChatMessage";
import exp from "constants";
import {getUserInfo} from "../utils";
import {SendOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {sleep} from "react-query/types/core/utils";
import video from "./Video";

enum Commands {
  GAME_START = "game_start",
  GAME_UPDATE = "game_update",
  CHAT = "chat",
  PLAYER_DISCONNECT = "player_disconnect",
  WEB_RTC_MEDIA_OFFER = "web_rtc_media_offer",
  WEB_RTC_MEDIA_ANSWER = "web_rtc_media_answer",
  WEB_RTC_ICE_CANDIDATE = "web_rtc_ice_candidate",

  WEB_RTC_REMOTE_PEER_ICE_CANDIDATE = "remote_peer_ice_candidate"
}

export const Game = () => {
  const navigate = useNavigate();
  const [socketUrl, setSocketUrl] = useState(process.env["REACT_APP_WS_URL"] as string);
  const [chats, setChats] = useState<ChatMessageProps[]>([]);
  const [opponentInfo, setOpponentInfo] = useState(null)
  const [gameType, setGameType] = useState<string[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [isPlayerOne, setIsPlayerOne] = useState(false)
  //const [localStream, setLocalStream] = useState(null);
  //const [remoteStream, setRemoteStream] = useState(null);
  //const localVideo = useRef<HTMLMediaElement>();
  //const remoteVideo = useRef<HTMLMediaElement>();

  const [webRTCPeer, setWebRTCPeer] = useState(new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    }
  ))

  useEffect(() => {
    (
      async () => {
        if (!gameStarted || !gameType.includes("VIDEO")) return;
        console.log("INIT")
        const constraints = {
          audio: false,
          video: true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => webRTCPeer.addTrack(track, stream));


        //TODO: Fix this

        //localVideo.current.srcObject = stream;
        //(document.querySelector('#localVideo') as HTMLMediaElement).srcObject = stream;


        //document.querySelector('#localVideo').srcObject = stream;

        if (isPlayerOne) {
          console.log("PLAYER ONE")
          const localPeerOffer = await webRTCPeer.createOffer();
          await webRTCPeer.setLocalDescription(new RTCSessionDescription(localPeerOffer));
          sendMediaOffer(localPeerOffer);
        }
      }
    )();

    return () => {
    };

  }, [gameStarted])

  const {sendMessage, lastMessage} = useWebSocket(socketUrl, {
    share: true,
    queryParams: {'token': localStorage.getItem('token')!!}
  });


  const handleMediaOffer = async (data: any) => {
    console.log("RECEIVED MEDIA OFFER")
    console.log(data)
    await webRTCPeer.setRemoteDescription(new RTCSessionDescription(data.offer));
    const peerAnswer = await webRTCPeer.createAnswer();
    await webRTCPeer.setLocalDescription(new RTCSessionDescription(peerAnswer));
    sendMediaAnswer(peerAnswer, data);
  };

  const handleMediaAnswer = async (data: any) => {
    console.log("GOT MEDIA ANSWER")
    console.log(data)
    await webRTCPeer.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  webRTCPeer.onicecandidate = (event) => {
    sendIceCandidate(event);
  }

  const handleRemotePeerIceCandidate = async (data: any) => {
    console.log("RECEIVED RICE CAN")
    console.log(data)
    try {
      const candidate = new RTCIceCandidate(data.candidate);
      await webRTCPeer.addIceCandidate(candidate);
    } catch (error) {
      console.log("RICE ERROR")
      console.log(error)
    }
  }

  webRTCPeer.addEventListener('track', (event) => {
    //TODO: Fix this
    console.log("New Track");

    const [stream] = event.streams;
    (document.querySelector('#remoteVideo') as HTMLMediaElement).srcObject = stream;
  })

  const sendMediaAnswer = (peerAnswer: any, data: any) => {
    console.log("SENDING MEDIA ANSWER")
    console.log(peerAnswer)
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_MEDIA_ANSWER,
      data: {
        answer: peerAnswer
      }
    }))
  }

  const sendMediaOffer = (localPeerOffer: any) => {
    console.log("SENDING MEDIA OFFER")
    console.log(localPeerOffer)
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_MEDIA_OFFER,
      data: {
        offer: localPeerOffer
      }
    }))
  }

  const sendIceCandidate = (event: any) => {
    console.log("SENDING ICE CAN")
    console.log(event)
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_ICE_CANDIDATE,
      data: {
        candidate: event.candidate
      }
    }))
  }


  const handleGameStart = (message: any) => {
    setGameType(message["game_type"])
    setOpponentInfo(message["opponent"])
    setIsPlayerOne(message["is_player_one"])
    setGameStarted(true)
  }

  const handleGameDisconnect = (message: any) => {
    notification.error({message: 'The other player has left the game. Please Refresh the Page', duration: 5})
    setGameStarted(false)
    setChats([])
    setOpponentInfo(null)
    setGameType([])
  }


  const handleWebsocketMessage = (message: MessageEvent) => {
    let messageJSON = JSON.parse(message.data)

    let data = messageJSON["data"]
    let type = messageJSON["type"]
    if (type === Commands.CHAT) {
      setChats(chats.concat(data));
    } else if (type === Commands.GAME_START) {
      handleGameStart(data)
    } else if (type === Commands.PLAYER_DISCONNECT) {
      handleGameDisconnect(data)
    } else if (type === Commands.WEB_RTC_MEDIA_ANSWER) {
      handleMediaAnswer(data)
    } else if (type === Commands.WEB_RTC_MEDIA_OFFER) {
      handleMediaOffer(data)
    } else if (type === Commands.WEB_RTC_REMOTE_PEER_ICE_CANDIDATE) {
      handleRemotePeerIceCandidate(data)
    }
  }


  const [input, setInput] = useState('')
  useEffect(() => {
    if (lastMessage !== null) {
      handleWebsocketMessage(lastMessage)
    }
  }, [lastMessage, setChats]);


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

  if (!gameStarted) {
    return <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}><Spin tip="Looking for players"/>
    </div>
  }

  return (
    <Row style={{width: '100%', height: '100vh', padding: '10px'}}>
      <Col span={16}>Play area</Col>
      <Col span={8} style={{backgroundColor: "black"}}>
        <div style={{width: '100%', height: '100%'}}>
          <div style={{width: '100%', height: "30%", backgroundColor: 'red'}}>
            {
              gameType.includes("INFO") && opponentInfo !== null && (
                <div>
                  You are playing with:<br/>
                  Name: {opponentInfo["name"]}<br/>
                  Year: {opponentInfo["year"]}<br/>
                  Department: {opponentInfo["department"]}<br/>
                  Hall: {opponentInfo["hall"]}<br/>
                </div>
              )
            }

          </div>
          <div style={{width: '100%', height: "30%", backgroundColor: 'yellow'}}>

            <video id="remoteVideo" playsInline autoPlay></video>
            <video id="localVideo" playsInline autoPlay></video>


          </div>
          <div style={{width: '100%', height: "30%", backgroundColor: 'green', overflowY: 'scroll'}}>
            <div style={{backgroundColor: '#f1f1f1'}}>
              <List style={{
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
          </div>
        </div>
      </Col>
    </Row>)

}
