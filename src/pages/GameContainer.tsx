import React, {useEffect, useState} from 'react';
import {Col, notification, Progress, Row, Spin} from "antd";
import useWebSocket from "react-use-websocket";
import {ChatMessageProps} from "../components/ChatMessage";
import {useNavigate} from "react-router-dom";
import {Commands} from "../constants";
import ChatBox from "../components/ChatBox";
import {getSuperscript} from "../utils";
import {Typography} from "antd";
import {useInterval} from 'usehooks-ts'
import {Game} from "../api";
import {getGameComponent} from "../games/GameUtils";

const {Text, Link} = Typography;

export const GameContainer = () => {
  const navigate = useNavigate();

  const [socketUrl, setSocketUrl] = useState(process.env["REACT_APP_WS_URL"] as string);
  const [chats, setChats] = useState<ChatMessageProps[]>([]);
  const [game, setGame] = useState<Game | null>(null);

  const [gameComponent, setGameComponent] = useState<any>(<div/>);
  const {sendMessage, lastMessage} = useWebSocket(socketUrl, {
    share: true,
    queryParams: {'token': localStorage.getItem('token')!!}
  });

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
        if (game === null || !game.infoType.includes("VIDEO")) return;
        const constraints = {
          audio: false,
          video: true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => webRTCPeer.addTrack(track, stream));
        (document.querySelector('#localVideo') as HTMLMediaElement).srcObject = stream;

        if (game.isServer) {
          const localPeerOffer = await webRTCPeer.createOffer();
          await webRTCPeer.setLocalDescription(new RTCSessionDescription(localPeerOffer));
          sendMediaOffer(localPeerOffer);
        }
      }
    )();

    return () => {
    };

  }, [game])


  const handleMediaOffer = async (data: any) => {
    await webRTCPeer.setRemoteDescription(new RTCSessionDescription(data.offer));
    const peerAnswer = await webRTCPeer.createAnswer();
    await webRTCPeer.setLocalDescription(new RTCSessionDescription(peerAnswer));
    sendMediaAnswer(peerAnswer, data);
  };

  const handleMediaAnswer = async (data: any) => {
    await webRTCPeer.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  webRTCPeer.onicecandidate = (event) => {
    sendIceCandidate(event);
  }

  const handleRemotePeerIceCandidate = async (data: any) => {
    try {
      const candidate = new RTCIceCandidate(data.candidate);
      await webRTCPeer.addIceCandidate(candidate);
    } catch (error) {
    }
  }

  webRTCPeer.addEventListener('track', (event) => {
    const [stream] = event.streams;
    (document.querySelector('#remoteVideo') as HTMLMediaElement).srcObject = stream;
  })

  const sendMediaAnswer = (peerAnswer: any, data: any) => {
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_MEDIA_ANSWER,
      data: {
        answer: peerAnswer
      }
    }))
  }

  const sendMediaOffer = (localPeerOffer: any) => {
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_MEDIA_OFFER,
      data: {
        offer: localPeerOffer
      }
    }))
  }

  const sendIceCandidate = (event: any) => {
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_ICE_CANDIDATE,
      data: {
        candidate: event.candidate
      }
    }))
  }


  const handleGameStart = (message: any) => {
    setGame({
      gameName: message["game_name"],
      infoType: message["info_type"],
      opponent: message["opponent"],
      isServer: message["is_server"],
      config: message['config']
    })
    setGameComponent(getGameComponent(message["game_name"], message['config'],
      (event: any) => {
        console.log('&&')
        console.log(event)
        console.log('&&')
        sendMessage(event)
      }))
  }


  const handleGameDisconnect = (message: any) => {
    notification.error({message: 'The other player has left the game', duration: 5})
    setGame(null)
    setGameComponent(<div/>)
    setChats([])
    navigate('/')
  }


  const handleWebsocketMessage = (message: MessageEvent) => {
    let messageJSON = JSON.parse(message.data)

    let data = messageJSON["data"]
    let type = messageJSON["type"]


    console.log(messageJSON)
    console.log('------------NM---------------')
    if (type === Commands.CHAT) {
      setChats(chats.concat(data));
    } else if (type === Commands.GAME_START) {
      handleGameStart(data)
    } else if (type === Commands.PLAYER_DISCONNECT) {
      handleGameDisconnect(data)
    } else if (type === Commands.WEB_RTC_MEDIA_ANSWER) {
      handleMediaAnswer(data).then(r => {
      })
    } else if (type === Commands.WEB_RTC_MEDIA_OFFER) {
      handleMediaOffer(data).then(r => {
      })
    } else if (type === Commands.WEB_RTC_REMOTE_PEER_ICE_CANDIDATE) {
      handleRemotePeerIceCandidate(data).then(r => {
      })
    }
  }


  useEffect(() => {
    if (lastMessage !== null) {
      handleWebsocketMessage(lastMessage)
    }
  }, [lastMessage]);


  if (game === null) {
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
    <Row style={{width: '100%', height: '100%'}}>
      <Col span={16}>
        <div>
          {gameComponent}
        </div>
      </Col>
      <Col span={8}>
        <div style={{width: '100%', height: '100%', maxHeight: '94vh', padding: '10px'}}>
          <div style={{width: '100%', height: '25%', boxSizing: 'border-box'}}>
            {
              game.infoType.includes("INFO") && game.opponent !== null && (
                <div style={{wordBreak: 'break-word'}}>
                  The other person is <Text mark strong code>{game.opponent["name"]}</Text>.
                  A <Text mark strong code>{getSuperscript(game.opponent["year"])}</Text> year
                  student in the department of <Text mark strong code>{game.opponent["department"]}</Text>
                  from <Text mark strong code>{game.opponent["hall"]}</Text>
                </div>
              )
            }

          </div>
          <div style={{
            width: '100%',
            height: '30%', boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'end'
          }}>
            <div style={{width: '60%', height: 'fit-content', padding: '2px'}}>
              <video height="auto" width="100%" id="remoteVideo" playsInline autoPlay></video>
            </div>
            <div style={{width: '40%', height: 'fit-content', padding: '2px'}}>
              <video height="auto" width="100%" id="localVideo" playsInline autoPlay></video>
            </div>
          </div>
          <div style={{height: '45%', width: '100%'}}>
            <ChatBox chats={chats} sendMessage={sendMessage}/>
          </div>
        </div>
      </Col>
    </Row>)

}
