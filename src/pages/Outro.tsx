import React, {useEffect, useRef, useState} from 'react';
import {notification, Select, Typography} from "antd";
import rpcImage from "../assets/old/rpc.png"
import sgImage from "../assets/old/sq.png"
import {useNavigate} from "react-router-dom";

const {Option} = Select
const {Title, Paragraph, Text, Link} = Typography;

const Instructions = () => {
  const navigate = useNavigate();
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
    if (countdown > 5) {
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
      <Title level={2}>Thanks You</Title>
      <span>for taking part in the experiment</span>
      <span>Returning To Home Page In {Math.max(5 - countdown, 0)} Seconds</span>
    </Typography>
  )
};

export default Instructions;
