import React, {useState} from 'react';
import {Button, Col, Divider, Image, Row, Select, Space, Typography} from "antd";
import image from "../assets/PrisonersDilemma.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface PoliceProps {
  game: Game
  callback: Function
}

const Police = ({game, callback}: PoliceProps) => {

  const [action, setAction] = useState<string | null>(null)

  return (
    <Typography>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Image width={'25em'} src={image}/>
        <Paragraph style={{padding: '10px'}}>
          The police found you and the other player exploiting the ATM machine. Both of you are held in different cells.
          The police officer offers you both the opportunity to either remain silent or blame the other.
          <ul>
            <li>If both of you <Text strong>remain silent</Text>, both will be <Text strong>fined ₹2.5</Text>
            </li>
            <li>If both of you <Text strong>blame each other</Text>, both will be <Text strong>fined ₹5</Text>
            </li>
            <li>If one of you blames the other and the other remains silent, the one who
              remained silent be <Text strong>fined ₹10</Text>, while <Text strong>the other would
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
                  callback('confess')
                  setAction('confess')
                }
                }>Blame The Other Person</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('deny')
                  callback('deny')
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

export default Police;
