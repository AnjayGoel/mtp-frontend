import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Divider, Image, notification, Progress, Row, Select, Slider, Space, Typography} from "antd";
import image from "../assets/PrisonersDilemma.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface PrisonerDilemmaProps {
  game: Game
  callback: Function
}

const PrisonerDilemma = ({game, callback}: PrisonerDilemmaProps) => {

  const [action, setAction] = useState<string | null>(null)

  const [countdown, setCountdown] = useState<number>(1);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  const initInterval = () => {
    intervalRef.current = setInterval(() => {
      setCountdown(countdown + 1)
    }, 1000);
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }

  const reset = () => {
    setAction(null)
    setCountdown(0)
    initInterval()
  }

  useEffect(() => {
    return initInterval()
  });

  useEffect(() => {
    if (game.config['timeout'] - countdown < 5 && game.config['timeout'] - countdown > 0) {
      notification.info({
        message: `Hurry, ending in ${game.config['timeout'] - countdown} seconds`,
        key: 'timeout'
      })
    }
    if (game.config['timeout'] - countdown < 0 || game.config['timeout'] - countdown > 5) {
      notification.destroy('timeout')
    }

    if (countdown > game.config['timeout']) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      callback(game.config['default'])
      reset()
    }
  }, [countdown])

  return (
    <Typography>
      <Progress showInfo={false} percent={countdown * 100 / game.config['timeout']}/>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Image width={'25em'} src={image}/>
        <Paragraph style={{padding: '10px'}}>
          The police found you and the other player exploiting the ATM machine. Both of you are held in different cells.
          The police officer offers you both the opportunity to either remain silent or blame the other.
          <ul>
            <li>If both of you <Text strong>remain silent</Text>, both will be <Text strong>fined 100 rupees</Text>
            </li>
            <li>If both of you <Text strong>blame each other</Text>, both will be <Text strong>fined 300 rupees</Text>
            </li>
            <li>If one of you blames the other and the other remains silent, the one who
              remained silent be <Text strong>fined 500 rupees</Text>, while <Text strong>the other would
                be set free</Text>.
            </li>
          </ul>
        </Paragraph>
        <Divider/>
        {action === null && (
          <div>
            <Text strong>What wil you do?</Text>
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  callback('c')
                  setAction('c')
                }
                }>Blame Other</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('d')
                  callback('d')
                }}>Remain Silent</Button>
              </Col>
            </Row>
          </div>
        )}
        {action !== null && (
          <Space><LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other player to respond</Text>
          </Space>
        )}
      </div>
    </Typography>
  )
};

export default PrisonerDilemma;
