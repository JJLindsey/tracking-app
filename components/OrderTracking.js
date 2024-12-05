import { CheckCircle, Inventory, LocalShipping, Schedule } from "@mui/icons-material"
import { Alert, Box, Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

const OrderTracking = () => {
    const [orderStatus, setOrderStatus] = useState('preparing')
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

    const statusIcons = (status) => {
        switch (status) {
            case 'preparing':
                return <Inventory />
            case 'shipping':
                return <LocalShipping />
            case 'delivered':
                return <CheckCircle />
            default: 
                return <Schedule />
        }
    }

    const steps = ['Order Received', 'Preparing', 'Shipping', 'Delivered']
    const currentStep = steps.indexOf(orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1))

    return(
        <Card >
            <CardContent>
                <Box>
                    <Typography>Oder Tracking</Typography>
                    <Typography>Order #ORDER111</Typography>
                </Box>
                {webSocketStatus !== 'connected' && (
                    <Alert severity="error">Connection Lost. Attempting to reconnect...</Alert>
                )}
                <Box
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        borderRadius: 1, 
                        bgcolor: 'background.default',
                        border: 1,
                        borderColor: 'divider'
                    }}
                >
                    <Box>
                        {statusIcons(orderStatus)}
                        <Box>
                            <Typography>{orderStatus}</Typography>
                            {lastestUpdate && (
                                <Typography>Last updated: {lastestUpdate}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Stepper activeStep={currentStep}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </CardContent>
        </Card>
    )
}
export default OrderTracking