import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Image, Row, Select, Slider, Space, Typography} from "antd";
import image from "../assets/Investment.png"
import {LoadingOutlined} from "@ant-design/icons";
import {getUserInfo} from "../utils";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface InvestmentProps {
  game: Game
  callback: Function
}

const Investment = ({game, callback}: InvestmentProps) => {

  const [serverAction, setServerAction] = useState<number | null>(null)
  const [clientAction, setClientAction] = useState<number | null>(null)
  const [response, setResponse] = useState<number>(2.5)

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
            callback(0)
          }
          setResponse(Math.floor(game.state[email] * 400 / 2) / 100)
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
                After the whole ordeal with the police, you and the other person have stumbled upon another opportunity in
                the stock market, this time its totally legal & safe.
                <ul>
                  <li> You have <Text strong>₹5</Text>, you can keep some (or all) of it and invest the rest </li>
                  <li> Whatever you invest will be <Text strong>quadrupled (4x)</Text> and given to the other person</li>
                  <li> The other person will have an option to keep some (or all) of the final amount and send
                    the rest back to you
                  </li>
                </ul>
              </Paragraph>
            )
          }
          {!game.isServer && (
            <Paragraph>
              After the whole ordeal with the police, you and the other person have stumbled upon another opportunity in
              the stock market, this time its totally legal & safe.
              <ul>
                <li> The other person has <Text strong>₹5</Text>, they can keep some (or all) of it and invest the
                  rest
                </li>
                <li> Whatever they invest will be <Text strong>quadrupled (4x)</Text> and given to you</li>
                <li> You have an option to keep some (or all) of the final amount and send the rest back to the
                  other person
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
                    marks={{0: "₹0", 5: "₹5"}}
                    defaultValue={2.5} min={0} max={5} step={0.25}
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
            <Text strong>Please wait for other person to respond</Text>
          </Space>
        )}

        {!game.isServer && serverAction !== null && clientAction == null && (
          <div>
            The other person sent you <Text strong>₹{serverAction}</Text>. You now
            have <Text strong>₹{serverAction * 4} </Text>
            <Text>How much will you send back?</Text>
            <Row gutter={24} style={{width: '40vw'}}>
              <Col span={20}>
                <Slider
                  marks={{0: "₹0", [4 * serverAction]: `₹${4 * serverAction}`}}
                  defaultValue={Math.round(serverAction * 400 / 2) / 100}
                  min={0} max={4 * serverAction}
                  step={0.25}
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
              <Text strong>Please wait for other person to respond</Text>
            </Space>
          )
        }
        {(serverAction !== null && clientAction !== null) && (
          <Space>
            <LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait...</Text>
          </Space>
        )}
      </div>
    </Typography>
  )
};

export default Investment;
