import React, { useEffect, useState } from "react"

const OrderTracking = () => {
    const [oderStatus, setOrderStatus] = useState('preparing')
    const [lastestUpdate, setLatestUpdate] = useState('')
    const [webSocketStatus, setWebSocketStatus] = useState('connecting')
    const [socket, setSocket] = useState(null)

    useEffect(()=> {
        const ws = new WebSocket('wss://localhost:8080')

        ws.onopen = () => {
            setWebSocketStatus('connected')
            ws.send(JSON.stringify({
                type: 'subscribe',
                orderId: 'Order111'
            }))
        }
        ws.onmessage = () => {
            const data = JSON.parse(event.data)
            setOrderStatus(data.status)
            setLatestUpdate(new Date().toLocaleTimeString())
        }
        ws.onclose = () => {
            setWebSocketStatus('disconnected')
        }
        setSocket(ws)
        return () => {
            if (ws) {
                ws.close()
            }
        }
    }, [])

}