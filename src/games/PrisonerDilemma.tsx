import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Progress, Row, Select, Slider, Space, Typography} from "antd";
import pdImage from "../assets/pd.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Commands} from "../constants";
import {getDefaultResp, getGameTimeout} from "./GameUtils";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface PrisonerDilemmaProps {
  callback: Function
}

const PrisonerDilemma = ({callback}: PrisonerDilemmaProps) => {

  const [action, setAction] = useState<string | null>(null)
  const [response, setResponse] = useState<number>(5)
  const [respSent, setRespSent] = useState(false)

  const [countdown, setCountdown] = useState<number>(1);


  useEffect(() => {
    const timeout = getGameTimeout("prisoners_dilemma")
    console.log("[]")


    const interval = setInterval(() => {
        console.log("CALLED")
        console.log(countdown)
        console.log(Math.ceil(100.0 / timeout))
        console.log(countdown + Math.ceil(100.0 / timeout))

        setCountdown(countdown + Math.ceil(100.0 / timeout))
        if (countdown > 100) {
          callback(
            JSON.stringify({
              'type': Commands.GAME_UPDATE, data: getDefaultResp("prisoners_dilemma")
            }))
          setCountdown(0)
        }
      },
      1000
    )

    return () => clearInterval(interval);
  }, [])

  return (
    <Typography>
      <Progress percent={countdown}/>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <img style={{width: '30em', height: '25em'}} src={pdImage}/>
        <div style={{paddingRight: '10px'}}>
          The police has arrested you and your friend for a crime. Both of you are held in different cells.
          The police officer offers you both the opportunity to either remain silent or blame another suspect.
          <ul>
            <li>If both of you <Text strong>remain silent</Text>, both will serve only <Text strong>one year in
              prison</Text>.
            </li>
            <li>If you <Text strong>both blame each other</Text>, both will <Text strong>serve five years</Text> in
              prison.
            </li>
            <li>If one of you blames another and the other remains silent, the one who
              remained silent would serve <Text strong>twenty years</Text> in prison, while <Text strong>the other would
                be set free</Text>.
            </li>
          </ul>
        </div>
        <Divider/>
        {action === null && (
          <div>
            <Text strong>What wil you do?</Text>
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => setAction('c')}>Confess</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('d')
                }}>Remain Silent</Button>
              </Col>
            </Row>
          </div>
        )}
        {action !== null && !respSent && (
          <div>
            <Text strong>How trustworthy is the other player?</Text>
            <Row gutter={24} style={{width: '40vw'}}>
              <Col span={20}>
                <Slider
                  defaultValue={5} min={0} max={10}
                  marks={Object.fromEntries([...Array(11)].map((_, it) => {
                    return [it, it]
                  }))}
                  onChange={(value: number) => {
                    setResponse(value)
                  }}/>
              </Col>
              <Col span={4}>
                <Button block onClick={() => {
                  setRespSent(true)
                  callback({action: action, response: response})
                }}>
                  Done
                </Button></Col>
            </Row>
          </div>
        )}
        {respSent && (
          <Space><LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other player to respond</Text>
          </Space>
        )}
      </div>
    </Typography>
  )
};

export default PrisonerDilemma;
