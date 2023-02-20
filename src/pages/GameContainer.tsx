import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Col, notification, Row, Spin, Typography, Tour} from "antd";
import useWebSocket from "react-use-websocket";
import {ChatMessageProps} from "../components/ChatMessage";
import {useNavigate} from "react-router-dom";
import {C} from "../constants";
import ChatBox from "../components/ChatBox";
import {getSuperscript, Queue} from "../utils";
import {Game} from "../api";
import Police from "../games/Police";
import Investment from "../games/Investment";
import Intro from "../games/Intro";
import ATM from "../games/ATM";
import type {TourProps} from 'antd';
import Fade from "../games/Fade";
import "../games/styles.css";
import CountDown from "../components/Countdown";
import Outro from "../games/Outro";
import PlayerVideos from "../components/PlayerVideos";
import Restaurant from "../games/Restaurant";

const {Text, Paragraph} = Typography;

export const GameContainer = () => {
  const navigate = useNavigate();
  const [paired, setPaired] = useState(false)
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  const [remoteImageURI, setRemoteImageURI] = useState<string | null>(null)
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
  const [scores, setScores] = useState<number[]>([0, 0]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState(0)
  const [offerSent, setOfferSent] = useState(false)
  const [tourOpen, setTourOpen] = useState(false)

  const timerRef = useRef(null);
  const playAreaRef = useRef(null);
  const chatBoxRef = useRef(null);
  const infoRef = useRef(null);
  const videoRef = useRef(null);

  const iceCans = useMemo(() => {
    return new Queue([])
  }, [])
  const webRTCPeer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    })
  }, [])


  const {sendMessage, lastMessage} = useWebSocket(socketUrl, {
    share: true,
    onError: (event) => {
      navigate("/")
    },
    onClose: () => {
      if (game?.gameId !== 0) {
        notification.error({
          message: "You have been disconnected",
          duration: 3
        })
        navigate('/')
      }
    },
    queryParams: {'token': localStorage.getItem('token')!!}
  });

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (game === null && !paired) {
        sendMessage(JSON.stringify({type: C.RETRY_MATCHING, data: {}}))
      } else {
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    }, 3000);
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  });


  webRTCPeer.onicecandidate = (event) => {
    if (game === null) {
      iceCans.enqueue(event)
    } else {
      while (iceCans.getItems().length > 0) {
        sendIceCandidate(iceCans.dequeue())
      }
      sendIceCandidate(event)
    }
  }

  webRTCPeer.addEventListener('track', (event) => {
    const [stream] = event.streams;
    setRemoteStream(stream)
  })

  useEffect(() => {
    (
      async () => {
        if (game === null || !game.infoType.includes("VIDEO")) return;

        while (iceCans.getItems().length > 0) {
          sendIceCandidate(iceCans.dequeue())
        }

        const constraints = {
          audio: false,
          video: {width: 720, height: 480}
        };

        if (localStream === null) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            stream.getTracks().forEach(track => webRTCPeer.addTrack(track, stream));
            setLocalStream(stream)
          } catch (err: any) {
            notification.info({message: 'Failed to access webcam, Redirecting to home page', duration: 3})
            navigate('/')
          }
        }

        if (game.isServer && !offerSent) {
          setOfferSent(true)
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


  const handleRemotePeerIceCandidate = async (data: any) => {
    try {
      const candidate = new RTCIceCandidate(data.candidate);
      await webRTCPeer.addIceCandidate(candidate);
    } catch (error) {
    }
  }

  const handleRemoteImageURI = (data: any) => {
    setRemoteImageURI(data)
  }


  const sendMediaAnswer = (peerAnswer: any, data: any) => {
    sendMessage(JSON.stringify({
      type: C.WEB_RTC_MEDIA_ANSWER,
      data: {
        answer: peerAnswer
      }
    }))
  }

  const sendMediaOffer = (localPeerOffer: any) => {
    sendMessage(JSON.stringify({
      type: C.WEB_RTC_MEDIA_OFFER,
      data: {
        offer: localPeerOffer
      }
    }))
  }

  const sendIceCandidate = (event: any) => {
    sendMessage(JSON.stringify({
      type: C.WEB_RTC_ICE_CANDIDATE,
      data: {
        candidate: event.candidate
      }
    }))
  }


  const handleGameStart = (message: any) => {
    if (!paired) {
      setPaired(true)
    }
    if (message["game_id"] === 1) {
      setTourOpen(true)
    }
    setGame({
      gameId: message["game_id"],
      infoType: message["info_type"],
      opponent: message["opponent"],
      isServer: message["is_server"],
      config: message['config'],
      state: message['state']
    })
    setScores(message['scores'])
  }


  const handlePlayerDisconnect = (message: any) => {
    if (game?.gameId === 0) return;
    notification.error({message: 'The other player has left the game', duration: 5})
    setGame(null)
    setChats([])
    navigate('/')
  }


  const handleGameUpdate = (message: any) => {
    if (game == null) return;
    if (game.state !== null && game.state !== undefined && game.state.length > message['state'].length) return;
    setGame({...game, state: message['state']})
  }

  const handleWebsocketMessage = (message: MessageEvent) => {
    let messageJSON = JSON.parse(message.data)

    let data = messageJSON["data"]
    let type = messageJSON["type"]

    if (type !== C.REMOTE_IMAGE_URI)
      console.log(messageJSON);

    if (type === C.CHAT) {
      setChats(chats.concat(data));
    } else if (type === C.GAME_START) {
      handleGameStart(data)
    } else if (type === C.GAME_UPDATE) {
      handleGameUpdate(data)
    } else if (type === C.PLAYER_DISCONNECT) {
      handlePlayerDisconnect(data)
    } else if (type === C.WEB_RTC_MEDIA_ANSWER) {
      handleMediaAnswer(data).then(r => {
      })
    } else if (type === C.WEB_RTC_MEDIA_OFFER) {
      handleMediaOffer(data).then(r => {
      })
    } else if (type === C.WEB_RTC_REMOTE_PEER_ICE_CANDIDATE) {
      handleRemotePeerIceCandidate(data).then(r => {
      })
    } else if (type === C.REMOTE_IMAGE_URI) {
      handleRemoteImageURI(data)
    }
  }

  const getTourSteps = () => {
    const steps: TourProps['steps'] = [
      {
        title: 'Welcome',
        description: <Paragraph>
          Welcome. This experiment is part of my MTP thesis. As a part of the experiment, you have been <Text strong>
          paired with someone in realtime</Text>.
          You will be presented with various scenario where you have to make some choices.
          <Text strong>The monetary payoffs/rewards of each scenario is real </Text>
          (Paid at the end of the experiments via UPI).
        </Paragraph>,
        target: () => null,
      },
      {
        title: 'Play Area',
        description: 'This area will present you various scenarios, along with some choices to respond with.',
        target: () => playAreaRef.current,
      },
      {
        title: 'Timer',
        description: 'Each scenario has a time limit. Keep an eye on the timer',
        target: () => timerRef.current,
      }
    ];
    if (game?.infoType.includes("INFO")) {
      steps.push({
        title: 'Other Player\'s Info',
        description: 'This box shows some basic information about the other player',
        target: () => infoRef.current,
      })
    }
    if (game?.infoType.includes("VIDEO")) {
      steps.push({
        title: 'Webcam',
        description: 'Both of you can see each other through the webcam. (It may lag sometime)',
        target: () => videoRef.current,
      })
    }
    if (game?.infoType.includes("CHAT")) {
      steps.push({
        title: 'Chat',
        description: <div>
          You can use this chat-box to chat with the other player and make plans for the scenario.
          <Text strong> Do not reveal your identity</Text> (it will disqualify you from the experiment).
          Keep an eye out for new messages</div>,
        target: () => chatBoxRef.current,
      })
    }

    return steps
  }


  useEffect(() => {
    if (lastMessage !== null) {
      handleWebsocketMessage(lastMessage)
    }
  }, [lastMessage]);


  if (game === null) {
    return <div className='div-center'><Spin tip="Looking for players"/></div>
  }

  if (game.gameId === 0) {
    navigate("/thanks", {state: {scores: scores}})
  }

  return (
    <Row style={{width: '100%', height: '100%'}}>
      <Col span={16}>
        {(<div
            ref={timerRef}
            style={{paddingLeft: '10px', width: 'fit-content'}}>
            <CountDown gameId={game.gameId}
                       timeout={game.gameId === 5 && game.isServer ? game.config['timeout'] / 2 : game.config['timeout']}
                       changeCallback={(value: number) => {
                         if (value % 5 === 0) {
                           setCountdown(value);
                         }
                       }}
                       finishCallback={() => {
                         if (game === null) return;
                         sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: game?.config['default']}))
                       }}/>
          </div>
        )}
        <div ref={playAreaRef}>
          {game.gameId === 1 && (
            <Fade show={game.gameId === 1}>
              <Intro game={game} tourOpen={tourOpen} callback={(event: any) => {
                sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
              }}/>
            </Fade>
          )}
          {game.gameId === 2 && (
            <Fade show={game.gameId === 2}>
              <Restaurant game={game} callback={(event: any) => {
                sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
              }}/>
            </Fade>
          )}
          {game.gameId === 3 && (
            <Fade show={game.gameId === 3}>
              <ATM
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}
          {game.gameId === 4 && (
            <Fade show={game.gameId === 4}>
              <Police
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}

          {game.gameId === 5 && (
            <Fade show={game.gameId === 5}>
              <Investment
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}

          {game.gameId === 6 && (
            <Fade show={game.gameId === 6}>
              <Outro
                game={game}
                callback={(event: any) => {
                  sendMessage(JSON.stringify({'type': C.GAME_UPDATE, data: event}))
                }}/>
            </Fade>
          )}
        </div>
      </Col>
      <Col span={8}>
        <div style={{width: '100%', height: '100%', maxHeight: '94vh', padding: '10px'}}>
          <div
            ref={infoRef}
            style={{width: '100%', height: '15%', boxSizing: 'border-box'}}>
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
          <div
            ref={videoRef}
            style={{
              width: '100%',
              height: '40%'
            }}>
            {game.infoType.includes("VIDEO") &&
                <PlayerVideos
                    localStream={localStream}
                    remoteStream={remoteStream}
                    remoteAvatar={remoteImageURI == null ? game.opponent['avatar'] : remoteImageURI}
                    imageTrigger={countdown}
                    imageCallback={(imageUri: string) => {
                      sendMessage(JSON.stringify({
                        type: C.REMOTE_IMAGE_URI,
                        data: imageUri
                      }))
                    }}
                />
            }
          </div>
          <div
            ref={chatBoxRef}
            style={{height: '45%', width: '100%'}}>
            {
              game.infoType.includes("CHAT") &&
                <ChatBox chats={chats} sendMessage={sendMessage}/>
            }
          </div>
        </div>
      </Col>
      <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={getTourSteps()}/>
    </Row>
  )
}
