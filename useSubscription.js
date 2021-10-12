import { useContext, useEffect, useCallback, useState } from 'react';

import { matches } from 'mqtt-pattern';

import MqttContext from './Context';

export default function useSubscription(topic, options = {}) {
  const { client, connectionStatus, parserMethod } = useContext(MqttContext);
  console.log(client)
  const [message, setMessage] = useState(undefined);

  const subscribe = useCallback(async () => {
    client.subscribe(topic, options);
  }, [client, options, topic]);

  const callback = useCallback((receivedTopic, receivedMessage) => {
      if ([topic].flat().some(rTopic => matches(rTopic, receivedTopic))) {
        setMessage({
          message: parserMethod?.(receivedMessage) || receivedMessage.toString(),
          topic: receivedTopic,
        });
      }
    },
    [parserMethod, topic],
  );

  useEffect(() => {
    if (client.connected) {
      subscribe();

      client.on(`message`, callback);
    }
  }, [callback, client, subscribe]);

  return {
    client,
    connectionStatus,
    message,
    topic,
  };
}