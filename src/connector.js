import { connect } from 'mqtt'
import React, { Fragment, useCallback, useEffect, useState, useRef } from 'react'

import MqttContext from './context'
import { STATUSES } from './types'

export default function Connector({
  brokerUrl,
  children,
  enabled,
  options = { keepalive: 0 },
  parserMethod
}) {
  if (!enabled) return <Fragment>{children}</Fragment>
  const clientRef = useRef(null)
  const [connectionStatus, setStatus] = useState(`Offline`)

  const mqttConnect = useCallback(async () => {
    setStatus(STATUSES.CONNECTING)
    clientRef.current = connect(brokerUrl, options)

    clientRef.current.on(`connect`, () => {
      setStatus(STATUSES.CONNECTED)
    })
    clientRef.current.on(`reconnect`, () => {
      setStatus(STATUSES.RECONNECTING)
    })
    clientRef.current.on(`disconnect`, () => {
      setStatus(STATUSES.DISCONNECTING)
    })
    clientRef.current.on(`error`, (err) => {
      console.log(`Connection error: ${err}`)
      setStatus(err.message)
    })
    clientRef.current.on(`offline`, () => {
      setStatus(STATUSES.OFFLINE)
    })
    clientRef.current.on(`end`, () => {
      setStatus(STATUSES.OFFLINE)
    })
  }, [brokerUrl, options])

  useEffect(() => {
    if (!clientRef.current) {
      mqttConnect()
    }
    return () => {
      clientRef.current.end(true)
      clientRef.current = null
    }
  }, [clientRef, mqttConnect, parserMethod])

  return (
    <MqttContext.Provider value={{ client: clientRef.current, connectionStatus, parserMethod }}>
      {children}
    </MqttContext.Provider>
  )
}
