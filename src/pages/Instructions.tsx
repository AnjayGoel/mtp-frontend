import React from 'react';
import {Select, Typography} from "antd";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

const Instructions = () => {


  return (
    <Typography>
      <Paragraph>
        Thanks for taking part in the online experiment. Before proceeding further, let us take a look at few things.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Requirements</Title>
        <ul>
          <li>A laptop with <Text strong>stable internet connection</Text> and a <Text strong>working webcam</Text></li>
          <li>Ensure that your webcam is working. And allow access if requested</li>
          <li><Text strong>Do not refresh </Text> the page during the experiment. This will disconnect you from the
            experiment session.
          </li>
        </ul>


        <Title level={5}>Gameplay</Title>
        <ul>
          <li>You will be <Text strong>paired with someone in realtime</Text></li>
          <li>You might be presented some varying levels of information about the other person</li>
          <li>You will be presented with various scenario. <Text strong>The monetary payoffs/rewards of each
            scenario is real</Text> (Given at the end of the experiments).
          </li>
        </ul>
      </Paragraph>
    </Typography>
  )
};

export default Instructions;
