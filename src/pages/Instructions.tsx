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
          <li>The outcome (say the scores) of the game is decided based on choices made by you and your opponent.</li>
          <li> You will encounter two kinds of games in this experiment: Sequential and Simultaneous.</li>
        </ul>

      </Paragraph>

      <span style={{display:'flex', justifyContent:'center'}}>
        <div style={{paddingLeft:'10px'}}>
        In the <Text strong>simultaneously games</Text>, both you and the other player will make a choice
        simultaneously, like a <Text strong>game of rock paper and scissors</Text>. The possible outcomes of each game
        will be represented as a table, where the column indicates your choice and the row indicates the choice of the
        opponents. The outcome of each pair of choices is given in the cell as a pair of numbers. The first number is
        your (Column Player) payoff and the second is of the opponents (Row Player).
        For example, the game of rock papers scissors will look like this. You play Blue (or column) and your opponent
        plays Red (the row).
        </div>
      </span>

      <br/>
      <div style={{display:'flex', justifyContent:'center'}}>
        <div style={{paddingRight:'10px'}}>
        The <Text strong>sequential games</Text> are like <Text strong>tick tack toe</Text>, chess or checks. Here both
        of you will take a turn till the game finishes. This form of game will be represented as a tree. With each node being a players turn and each edge
        their choice. The leaf (last) nodes have the payoff marked as a pair with payoff of first player coming first.
        For example the game below
        </div>
      </div>

    </Typography>
  )
};

export default Instructions;
