import React, { useState, useEffect, useRef } from 'react';

const states = {
  red: { next: 'green', delay: 5000 },
  yellow: { next: 'red', delay: 2000 },
  green: { next: 'yellow', delay: 4000 },
};

const startState = 'red';

export default function TrafficLight() {
  const [current, setCurrent] = useState(startState);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(states[startState].delay / 1000);

  const intervalRef = useRef(null);
  const timeLeftRef = useRef(states[startState].delay);

  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    intervalRef.current = setInterval(() => {
      timeLeftRef.current -= 1000;
      setSecondsLeft(Math.ceil(timeLeftRef.current / 1000));

      if (timeLeftRef.current <= 0) {
        const nextState = states[current].next;
        setCurrent(nextState);
        timeLeftRef.current = states[nextState].delay;
        setSecondsLeft(states[nextState].delay / 1000);
      }
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, current]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setCurrent(startState);
    timeLeftRef.current = states[startState].delay;
    setSecondsLeft(states[startState].delay / 1000);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <div style={{ width: 60, margin: '0 auto' }}>
        {['red', 'yellow', 'green'].map((color) => (
          <div
            key={color}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              marginBottom: 10,
              backgroundColor: current === color ? color : '#ddd',
            }}
          />
        ))}
      </div>

      <div style={{ fontSize: 24, marginTop: 10 }}>
        {isRunning ? `${secondsLeft}s left` : 'Paused'}
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={isRunning ? pause : start}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button style={{ marginLeft: 10 }} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
