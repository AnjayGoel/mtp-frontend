import React, {useState} from 'react';
import {Button, Divider, Select, Space, Typography} from "antd";
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

  return (
    <Typography style={{width: '100%', height: '100%'}}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingRight: '10px',
        paddingLeft: '10px'
      }}>
        <div>
          Welcome. As a part of the experiment, you have been <Text strong>paired with someone in realtime</Text><br/>
          <ul>
            <li>
              You will be presented with various scenario. The outcome of which depends on the choices made by you and
              the other player
            </li>
            <li>Though there is no real monetary reward, Please <Text strong>assume the scenarios to be real</Text>,
              while making the decisions
            </li>
            <li>
              You will not be shown the choices made by the other person and the outcome of each scenario
            </li>
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
            <p>
              Take a minute to look around the screen and press ready when you are done.
            </p>
            <Button
              type="primary"
              onClick={() => {
                setAction('')
                callback('')
              }}
            >
              Ready
            </Button>
          </div>
        )}
      </div>
    </Typography>
  )
};

export default Intro;
