const WebSocket = require('ws')
const wss = new WebSocket.Server({port: 8080})

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        if (data.type === 'subscribe') {
            ws.orderId = data.orderId
        }
    })

setInterval(() => {
    if (ws.orderId) {
        ws.send(JSON.stringify({
            status: [ 'preparing', 'shipping', 'delivered'][Math.floor(Math.random() * 3)],
            timestamp: new Date().toISOString
        }))
    }
}, 5000)
})
console.log('Websocket server running on port 8080')