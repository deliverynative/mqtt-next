import { useContext, useEffect, useCallback, useState } from 'react'

import { matches } from 'mqtt-pattern'

import MqttContext from './context'

export default function useSubscription(topic, options = {}) {
  const { client, connectionStatus, parserMethod } = useContext(MqttContext)
  const [message, setMessage] = useState(undefined)

  const subscribe = useCallback(async () => {
    client.subscribe(topic, options)
  }, [client, options, topic])

  const callback = useCallback(
    (receivedTopic, receivedMessage) => {
      if ([topic].flat().some((rTopic) => matches(rTopic, receivedTopic))) {
        setMessage({
          message:
            parserMethod?.(receivedMessage) || receivedMessage.toString(),
          topic: receivedTopic
        })
      }
    },
    [parserMethod, topic]
  )

  useEffect(() => {
    if (client.connected) {
      subscribe()

      client.on(`message`, callback)
    }
    return () => {
      client.off('message', callback)
    }
  }, [callback, client, subscribe, topic])

  return {
    client,
    connectionStatus,
    message,
    topic
  }
}
