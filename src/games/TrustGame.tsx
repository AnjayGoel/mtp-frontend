import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Image, Row, Select, Slider, Space, Typography} from "antd";
import image from "../assets/TrustGame.png"
import {LoadingOutlined} from "@ant-design/icons";
import {getUserInfo} from "../utils";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface TrustGameProps {
  game: Game
  callback: Function
  state: any
}

const TrustGame = ({game, callback, state}: TrustGameProps) => {

  const [serverAction, setServerAction] = useState<number | null>(null)
  const [clientAction, setClientAction] = useState<number | null>(null)
  const [response, setResponse] = useState<number>(50)

  useEffect(() => {
    if (game.isServer) {
      for (let email in game.state) {
        if (email === getUserInfo()['email']) {
          setServerAction(game.state[email])
        } else {
          setClientAction(game.state[email])
        }
      }
    } else {
      for (let email in game.state) {
        if (email === getUserInfo()['email']) {
          setClientAction(game.state[email])
        } else {
          setServerAction(game.state[email])
          if (game.state[email] === 0) {
            setClientAction(0)
          }
          setResponse(Math.floor(game.state[email] * 3 / 2))
        }
      }
    }

  }, [game.state])


  return (
    <Typography>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Image width={'25em'} src={image}/>
        <div style={{padding: '10px'}}>
          {
            game.isServer && (
              <Paragraph>
                After the whole ordeal with the police, you and the other player have stumbled upon another opportunity in
                the stock market (its totally legal).
                <ul>
                  <li> You have 100 rupees, you can keep any proportion (including all) of it and invest the rest</li>
                  <li> Whatever you invest will be <Text strong>tripled</Text> and given to the other player</li>
                  <li> The other player will have an option to keep any proportion (including all) of the sum and send
                    rest back to you
                  </li>
                </ul>
              </Paragraph>
            )
          }
          {!game.isServer && (
            <Paragraph>
              After the whole ordeal with the police, you and the other player have stumbled upon another opportunity in
              the stock market (its totally legal).
              <ul>
                <li> The other player has 100 rupees, they can keep any proportion (including all) of it and invest the
                  rest
                </li>
                <li> Whatever they invest will be <Text strong>tripled</Text> and given to the you</li>
                <li> You have an option to keep any proportion (including all) of the sum and send rest back to the
                  other player
                </li>
              </ul>
            </Paragraph>
          )}
        </div>
        <Divider/>
        {game.isServer && serverAction === null &&
          (<div>
              <Text strong>What much will you invest?</Text>
              <Row gutter={24} style={{width: '40vw'}}>
                <Col span={20}>
                  <Slider
                    marks={{0: 0, 100: 100}}
                    defaultValue={50} min={0} max={100}
                    onChange={(value: number) => {
                      setResponse(value)
                    }}/>
                </Col>
                <Col span={4}>
                  <Button block onClick={() => {
                    setServerAction(response)
                    callback(response)
                  }}>
                    Done
                  </Button></Col>
              </Row>
            </div>
          )}
        {game.isServer && serverAction !== null && clientAction === null && (
          <Space>
            <LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other player to respond</Text>
          </Space>
        )}

        {!game.isServer && serverAction !== null && clientAction == null && (
          <div>
            <Text strong>The other player sent you {serverAction} rupees. You now
              have {serverAction * 3} rupees. </Text>
            <Text>How much will you send back?</Text>
            <Row gutter={24} style={{width: '40vw'}}>
              <Col span={20}>
                <Slider
                  marks={{0: 0, [3 * serverAction]: 3 * serverAction}}
                  defaultValue={Math.floor(serverAction * 3 / 2)} min={0} max={3 * serverAction}
                  onChange={(value: number) => {
                    setResponse(value)
                  }}/>
              </Col>
              <Col span={4}>
                <Button block onClick={() => {
                  setClientAction(response)
                  callback(response)
                }}>
                  Done
                </Button></Col>
            </Row>
          </div>
        )}

        {!game.isServer && serverAction === null &&
          (
            <Space>
              <LoadingOutlined style={{fontSize: 24}} spin/>
              <Text strong>Please wait for other player to respond</Text>
            </Space>
          )
        }
      </div>
    </Typography>
  )
};

export default TrustGame;
