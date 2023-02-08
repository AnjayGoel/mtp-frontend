import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Divider, Image, notification, Progress, Row, Select, Slider, Space, Typography} from "antd";
import image from "../assets/Machine.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface MachineProps {
  game: Game
  callback: Function
}

const Machine = ({game, callback}: MachineProps) => {

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
        message: `Next game starting in ${game.config['timeout'] - countdown}`,
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
        <Image width='25em' src={image}/>
        <Paragraph style={{padding: '10px'}}>
          You and the other player have encountered a faulty ATM machine.
          If you put in 100 rupees in the machine, the other player gets
          300 rupees and vice versa. You both can either choose to put in the money, or not to.
        </Paragraph>
        <Divider/>
        {action === null && (
          <div>
            <Text strong>What wil you do?</Text>
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('c')
                  callback('c')
                }}>Put 100 Rupees</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  callback('d')
                  setAction('d')
                }}>Don't Put 100 Rupees</Button>
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

export default Machine;
