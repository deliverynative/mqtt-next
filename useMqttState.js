import { useContext } from 'react';

import MqttContext from './Context';

export default function useMqttState() {
  const { connectionStatus, client, parserMethod } = useContext(
    MqttContext,
  );

  return {
    client,
    connectionStatus,
    parserMethod,
  };
}