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
            Welcome. As a part of the experiment, you have been <Text strong>paired with someone in realtime</Text>.
            You will be presented with various scenario. <Text strong>The monetary payoffs/rewards of each
            scenario is real</Text> (Given at the end of the experiments).
            Also note that <Text strong> you will not know</Text> the choices made by other person or the outcome of
            each scenario
          </Paragraph>
          {game.infoType.length !== 0 && (
            <Paragraph>
              However you can,
              <ul>
                {game.infoType.includes('INFO') && (
                  <li>See some information about the other player in top right</li>
                )}

                {game.infoType.includes('CHAT') && (
                  <li>
                    Chat with them in bottom right box.
                    But please <Text strong>do not reveal your identity</Text>
                  </li>
                )}
                {game.infoType.includes('VIDEO') && (
                  <li>See each other through the webcam</li>
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
