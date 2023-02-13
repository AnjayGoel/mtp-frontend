import React, {useEffect, useRef, useState} from 'react';
import {Card, Col, notification, Row, Spin, Typography} from "antd";
import useWebSocket from "react-use-websocket";
import {ChatMessageProps} from "../components/ChatMessage";
import {useNavigate} from "react-router-dom";
import {Commands} from "../constants";
import ChatBox from "../components/ChatBox";
import {getSuperscript} from "../utils";
import {Game} from "../api";
import PrisonerDilemma from "../games/PrisonerDilemma";
import TrustGame from "../games/TrustGame";
import Intro from "../games/Intro";
import Machine from "../games/Machine";
import Fade from "../games/Fade";
import "../games/styles.css";
import CountDown from "../components/Countdown";
import Outro from "../games/Outro";
import PlayerVideos from "../components/PlayerVideos";

const {Text} = Typography;

export const GameContainer = () => {
  const navigate = useNavigate();
  const [paired, setPaired] = useState(false)
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  const [socketUrl, setSocketUrl] = useState(process.env["REACT_APP_WS_URL"] as string);
  const [chats, setChats] = useState<ChatMessageProps[]>([
    {
      name: 'System',
      email: 'system',
      avatar: '',
      message: 'Chat with the other player here'
    }
  ]);
  const [game, setGame] = useState<Game | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);


  const {sendMessage, lastMessage} = useWebSocket(socketUrl, {
    share: true,
    onError: (event) => {
      navigate("/")
    },
    queryParams: {'token': localStorage.getItem('token')!!}
  });

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (game === null && !paired) {
        sendMessage(JSON.stringify({type: Commands.RETRY_MATCHING, data: {}}))
      } else {
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    }, 3000);
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
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

        if (localStream !== null && remoteStream !== null) {
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => webRTCPeer.addTrack(track, stream));
        setLocalStream(stream)

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
    setRemoteStream(stream)
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
    if (remoteStream !== null) return;
    sendMessage(JSON.stringify({
      type: Commands.WEB_RTC_ICE_CANDIDATE,
      data: {
        candidate: event.candidate
      }
    }))
  }


  const handleGameStart = (message: any) => {
    if (!paired) {
      setPaired(true)
    }
    setGame({
      gameId: message["game_id"],
      infoType: message["info_type"],
      opponent: message["opponent"],
      isServer: message["is_server"],
      config: message['config'],
      state: message['state']
    })
  }


  const handlePlayerDisconnect = (message: any) => {
    if (game?.gameId === 0) return;
    notification.error({message: 'The other player has left the game', duration: 5})
    setGame(null)
    setChats([])
    navigate('/')
  }


  const handleGameUpdate = (message: any) => {
    console.log(message)
    console.log(game)
    if (game == null) return;
    if (game.state !== null && game.state !== undefined && game.state.length > message['state'].length) return;
    setGame({...game, state: message['state']})
  }

  const handleWebsocketMessage = (message: MessageEvent) => {
    let messageJSON = JSON.parse(message.data)

    let data = messageJSON["data"]
    let type = messageJSON["type"]

    console.log(messageJSON)

    if (type === Commands.CHAT) {
      setChats(chats.concat(data));
    } else if (type === Commands.GAME_START) {
      handleGameStart(data)
    } else if (type === Commands.GAME_UPDATE) {
      handleGameUpdate(data)
    } else if (type === Commands.PLAYER_DISCONNECT) {
      handlePlayerDisconnect(data)
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

  if (game.gameId === 0) {
    navigate("/thanks")
  }

  return (
    <Row style={{width: '100%', height: '100%'}}>
      <Col span={16}>
        <div>
          {(
            <CountDown gameId={game.gameId} timeout={game.config['timeout']} callback={() => {
              if (game === null) return;
              sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: game?.config['default']}))
            }}/>
          )}
          {game.gameId === 1 && (
            <Fade show={game.gameId === 1}>
              <Intro game={game} callback={(event: any) => {
                sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
              }}/>
            </Fade>
          )
          }
          {game.gameId === 2 && (
            <Fade show={game.gameId === 2}>
              <Machine
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}
          {game.gameId === 3 && (
            <Fade show={game.gameId === 3}>
              <PrisonerDilemma
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}

          {game.gameId === 4 && (
            <Fade show={game.gameId === 4}>
              <TrustGame
                state={game.state}
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}

          {game.gameId === 5 && (
            <Fade show={game.gameId === 5}>
              <Outro
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': Commands.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}
        </div>
      </Col>
      <Col span={8}>
        <div style={{width: '100%', height: '100%', maxHeight: '94vh', padding: '10px'}}>
          <div style={{width: '100%', height: '25%', boxSizing: 'border-box'}}>
            {
              game.infoType.includes("INFO") && game.opponent !== null && (
                <div style={{wordBreak: 'break-word'}}>
                  The other person is a <Text mark strong code>{getSuperscript(game.opponent["year"])}</Text> year
                  student in the department of <Text mark strong code>{game.opponent["department"]}</Text>
                  from <Text mark strong code>{game.opponent["hall"]}</Text>
                </div>
              )
            }

          </div>
          <div style={{
            width: '100%',
            height: '30%'
          }}>
            {game.infoType.includes("VIDEO") &&
                <PlayerVideos localStream={localStream}
                              remoteStream={remoteStream}
                              remoteAvatar={game.opponent['avatar']}/>
            }
          </div>
          <div style={{height: '45%', width: '100%'}}>
            {
              game.infoType.includes("CHAT") &&
                <ChatBox chats={chats} sendMessage={sendMessage}/>
            }
          </div>
        </div>
      </Col>
    </Row>)

}
