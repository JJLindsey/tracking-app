import { CheckCircle, Inventory, LocalShipping, Schedule } from "@mui/icons-material"
import { Alert, Box, Card, CardContent, Step, StepLabel, Stepper, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"

const OrderTracking = () => {
    const [orderStatus, setOrderStatus] = useState('preparing')
    const [latestUpdate, setLatestUpdate] = useState('')
    const [webSocketStatus, setWebSocketStatus] = useState('connecting')
    const [socket, setSocket] = useState(null)

    useEffect(()=> {
        const ws = new WebSocket('ws://localhost:8080')

        ws.onopen = () => {
            setWebSocketStatus('connected')
            ws.send(JSON.stringify({
                type: 'subscribe',
                orderId: 'Order111'
            }))
        }
        ws.onmessage = (event) => {
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
        <Card sx={{maxWidth: 600, margin: 'auto', mt: 2, mb: 3}} raised={true} >
            <CardContent>
                <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h6">Order Tracking</Typography>
                    <Typography>Order #ORDER111</Typography>
                </Box>
                {webSocketStatus !== 'connected' && (
                    <Alert severity="error" sx={{ mb: 2 }}>Connection Lost. Attempting to reconnect...</Alert>
                )}
                <Box
                    sx={{ 
                        p: 2, 
                        mb: 3, 
                        borderRadius: 1, 
                        bgcolor: '#d8fdd9',
                        borderColor: 'divider'
                    }}
                >
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        {statusIcons(orderStatus)}
                        <Box>
                            <Typography variant="subtitle1" sx={{textTransform: 'capitalize'}}>Status: {orderStatus}</Typography>
                            {latestUpdate && (
                                <Typography>Last updated: {latestUpdate}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>

                <Stepper activeStep={currentStep} orientation="vertical" sx={{ ml:2, mb: 3}}>
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