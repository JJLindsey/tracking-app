import React, { useEffect, useState } from "react"

const OrderTracking = () => {
    const [oderStatus, setOrderStatus] = useState('preparing')
    const [lastestUpdate, setLatestUpdate] = useState('')
    const [webSocketStatus, setWebSocketStatus] = useState('connecting')
    const [socket, setSocket] = useState(null)

    useEffect(()=> {
        const ws = new WebSocket('')
        
    })

}