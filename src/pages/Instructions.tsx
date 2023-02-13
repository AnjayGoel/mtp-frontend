import React from 'react';
import {Select, Typography} from "antd";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

const Instructions = () => {


  return (
    <Typography>
      <Paragraph>
        Thanks for joining the online experiment. Before proceeding further, let us take a look at the
        gameplay of the experiment.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Requirements</Title>
        <ul>
          <li>A laptop with <Text strong>stable internet connection</Text> and a <Text strong>working webcam</Text></li>
          <li>Ensure that your webcam is working. And allow access if requested</li>
          <li><Text strong>Do not refresh </Text> the page during the game. This will disconnect you from the
            game/session
          </li>
        </ul>


        <Title level={5}>Gameplay</Title>
        <ul>
          <li>You will be playing some games with a <Text strong>real person</Text></li>
          <li>You might be presented some varying levels of information about the other person</li>
          <li>The outcome of the game is decided based on choices made by you and your opponent.</li>
          <li>Though there is no real monetary reward, Please <Text strong>assume the scenarios to be real</Text>,
            while making the decisions
          </li>
        </ul>

      </Paragraph>
    </Typography>
  )
};

export default Instructions;
