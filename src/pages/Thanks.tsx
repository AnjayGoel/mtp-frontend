import React, {useEffect, useRef, useState} from 'react';
import {notification, Select, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

const Thanks = () => {
  const time = 30
  const navigate = useNavigate();
  const {state} = useLocation();
  const [countdown, setCountdown] = useState<number>(1);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  const initInterval = () => {
    intervalRef.current = setInterval(() => {
      setCountdown(countdown + 1)
    }, 1000);
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }

  useEffect(() => {
    return initInterval()
  });


  useEffect(() => {
    if (countdown > time) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      navigate('/')
    }
  }, [countdown])


  return (
    <Typography style={{
      padding: '30px',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Title level={2}>Thank You</Title>
      <span>for taking part in the experiment</span>
      <div style={{margin: '30px'}}>
      <span>
        <Text strong>You {state.scores[0] > 0 ? 'won' : 'lost'} ₹{Math.abs(state.scores[0])}</Text>,
        while the other person {state.scores[1] > 0 ? 'won' : 'lost'}  ₹{Math.abs(state.scores[1])}.
      </span>
        {state.scores[0] < 0 && (
          <span> Don't worry, we wont make you pay us</span>
        )}
      </div>
      <span>Returning to the home page in {Math.max(time - countdown, 0)} Seconds</span>
    </Typography>
  )
};

export default Thanks;
