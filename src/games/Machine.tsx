import React, {useState} from 'react';
import {Button, Col, Divider, Image, Row, Select, Space, Typography} from "antd";
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

  return (
    <Typography>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Image width='25em' src={image}/>
        <Paragraph style={{padding: '10px'}}>
          You and the other player have encountered a faulty ATM machine.
          If you put in <Text strong>₹5</Text> in the machine, the other player gets
          <Text strong> ₹15</Text> (and you lose the ₹5, obviously) and vice versa. You both can either choose to
          put in the money, or not to.
        </Paragraph>
        <Divider/>
        {action === null && (
          <div>
            <Text strong>What wil you do?</Text>
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('put')
                  callback('put')
                }}>Put ₹5 In The Machine</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  callback('dont')
                  setAction('dont')
                }}>Don't Put ₹5 In The Machine</Button>
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
