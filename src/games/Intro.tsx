import React, {useEffect, useRef, useState} from 'react';
import {Button, Col, Divider, Form, notification, Progress, Row, Select, Slider, Space, Typography} from "antd";
import pdImage from "../assets/old/pd.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface IntroProps {
  game: Game
  callback: Function
}

const Intro = ({game, callback}: IntroProps) => {
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
    <Typography style={{width: '100%', height: '100%'}}>
      <Progress showInfo={false} percent={countdown * 100 / game.config['timeout']}/>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingRight: '10px',
        paddingLeft: '30px'
      }}>
        <div>
          Welcome. To play the game, you have been paired with someone in realtime.<br/>
          <ul>
            {game.infoType.length === 0 && (
              <li>But alas, You can't know anything about them</li>
            )}
            {game.infoType.includes('INFO') && (
              <li>You can see some information about the other player in top right</li>
            )}
            {game.infoType.includes('CHAT') && (
              <li>You can chat with them in bottom right box. But please <Text strong>do not identify yourself</Text>
              </li>
            )}
            {game.infoType.includes('VIDEO') && (
              <li>You can see each other through the webcam</li>
            )}
          </ul>
        </div>
        <Divider/>
        {action !== null && (
          <Space><LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other player to respond</Text>
          </Space>
        )}
        {action == null && (
          <div>
            Before proceeding please answer this preliminary questions honestly.

            <Form
              layout='vertical'
              initialValues={{
                'know': false,
                'trust': 5
              }}
              onFinish={(values) => {
                setAction(values)
                callback(values)
              }}
            >

              <Form.Item
                label="Do you personally know the other person?"
                name="know"
                rules={[{required: true, message: 'Please, answer this question first'}]}
              >
                <Select
                  style={{width: 'fit-content'}}
                  options={[{label: 'Yes', value: true}, {label: 'No', value: false}]}
                  defaultValue={false}
                />
              </Form.Item>

              <Form.Item
                label="How trustworthy is the other person?"
                name="trust"
                rules={[{required: true, message: 'Please, answer this question first'}]}
              >
                <Slider min={0} max={10} defaultValue={5}/>
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Done
              </Button>

            </Form>
          </div>
        )}
      </div>
    </Typography>
  )
};

export default Intro;
