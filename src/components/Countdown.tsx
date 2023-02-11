import React, {useEffect, useRef, useState} from 'react';
import {notification, Progress} from "antd";


export interface CountDownProps {
  timeout: number,
  callback: Function,
  gameId: number
}

const CountDown = ({timeout, callback, gameId}: CountDownProps) => {
  const [countdown, setCountdown] = useState<number>(1);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  useEffect(() => {
    setCountdown(0)
  }, [gameId])

  const startCountdown = () => {
    intervalRef.current = setInterval(() => {
      setCountdown(countdown + 1)
    }, 1000);
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }

  useEffect(() => {
    return startCountdown()
  });

  useEffect(() => {
    if (timeout - countdown < 5 && timeout - countdown > 0) {
      notification.info({
        message: `Next game starting in ${timeout - countdown}`,
        key: 'timeout'
      })
    }
    if (timeout - countdown < 0 || timeout - countdown > 5) {
      notification.destroy('timeout')
    }

    if (countdown > timeout) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      callback()
      setCountdown(0)
      startCountdown()
    }
  }, [countdown])
  if (gameId === 0) {
    return <div/>
  }
  return (<Progress showInfo={false} percent={countdown * 100 / timeout}/>)
};

export default CountDown;
