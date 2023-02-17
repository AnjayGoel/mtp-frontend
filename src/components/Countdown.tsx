import React, {useEffect, useState} from 'react';
import {notification, Statistic} from "antd";

const {Countdown} = Statistic;

export interface CountDownProps {
  timeout: number,
  changeCallback: Function,
  finishCallback: Function,
  gameId: number
}

const CountDown = ({timeout, changeCallback, finishCallback, gameId}: CountDownProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [endTime, setEndTime] = useState(Date.now() + timeout * 1000);

  useEffect(() => {
    setCurrent(0)
    setEndTime(Date.now() + timeout * 1000)
  }, [gameId, timeout])


  useEffect(() => {
    if (current < 5 && current > 0) {
      notification.info({
        message: `Next game starting in ${current}`,
        key: 'timeout'
      })
    }
    if (current < 0 || current > 5) {
      notification.destroy('timeout')
    }
  }, [current])

  if (gameId === 0) {
    return <div/>
  }
  return (
    <span>
      <Countdown
        title="Time left" value={endTime}
        valueStyle={{color: current < 5 ? 'red' : 'black'}} format='ss'
        onChange={(value) => {
          if (value === undefined) return;
          if (typeof value == "string")
            value = Math.floor(parseInt(value) / 1000);
          else
            value = Math.floor(value / 1000);
          setCurrent(value)
          if (changeCallback) {
            changeCallback(value)
          }
        }}
        onFinish={() => {
          finishCallback()
          setCurrent(0)
          setEndTime(Date.now())
        }}
      />
    </span>)
}

export default CountDown;
