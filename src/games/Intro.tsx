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
          <Paragraph>
            Welcome. This experiment is part of my MTP thesis. As a part of the experiment, you have been <Text strong>
            paired with someone in realtime</Text>.
            You will be presented with various scenario where you have to make some choices. <Text strong>The monetary payoffs/rewards of each
            scenario is real</Text> (Paid at the end of the experiments via UPI).
          </Paragraph>
          {game.infoType.length !== 0 && (
            <Paragraph>
              Both of you can,
              <ul>
                {game.infoType.includes('INFO') && (
                  <li>See some information about the other player in <Text strong> top right</Text></li>
                )}

                {game.infoType.includes('CHAT') && (
                  <li>
                    <Text strong>Chat</Text> with each other in bottom right box to make strategies.
                    But please <Text strong>do not reveal your identity</Text>
                  </li>
                )}
                {game.infoType.includes('VIDEO') && (
                  <li>See each other through the <Text strong> webcam</Text></li>
                )}
              </ul>
            </Paragraph>)}

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
              Take a minute to look around the screen and press start when you are ready to begin.
            </p>
            <Button
              type="primary"
              onClick={() => {
                setAction('')
                callback('')
              }}
            >
              Start
            </Button>
          </div>
        )}
      </div>
    </Typography>
  )
};

export default Intro;
