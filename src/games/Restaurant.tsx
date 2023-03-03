import React, {useState} from 'react';
import {Button, Col, Divider, Image, Row, Select, Space, Typography} from "antd";
import image from "../assets/Restaurant.png"
import {LoadingOutlined} from "@ant-design/icons";
import {Game} from "../api";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

export interface RestaurantProps {
  game: Game
  callback: Function
}

const Restaurant = ({game, callback}: RestaurantProps) => {

  const [action, setAction] = useState<string | null>(null)

  return (
    <Typography>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
        <Image width={'25em'} src={image}/>
        <Paragraph style={{padding: '10px'}}>
          You and the other person own different restaurants on the opposite side of the same street.
          Both of you have two potential pricing strategies, <Text strong>low & high</Text>
          <ul>
            <li>If both of you keep the prices <Text strong>high</Text> both will earn <Text strong>₹5</Text></li>
            <li>If you <Text strong>lower</Text> the price, while the other person keeps it <Text
              strong>high</Text>, you will earn <Text strong>₹7.5</Text>, and the other would lose ₹2.5. And
              vice versa.
            </li>
            <li>However, If both of you <Text strong>lower</Text> the price, both will earn nothing (₹0).</li>
          </ul>
        </Paragraph>
        <Divider/>
        {action === null && (
          <div>
            <Text strong>What wil you do?</Text>
            <Row gutter={24} style={{minWidth: '40vw'}}>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  callback('high')
                  setAction('high')
                }
                }>Set Price High</Button>
              </Col>
              <Col span={12}>
                <Button type='primary' block onClick={() => {
                  setAction('low')
                  callback('low')
                }}>Set Price Low</Button>
              </Col>
            </Row>
          </div>
        )}
        {action !== null && (
          <Space><LoadingOutlined style={{fontSize: 24}} spin/>
            <Text strong>Please wait for other person to respond</Text>
          </Space>
        )}
      </div>
    </Typography>
  )
};

export default Restaurant;
