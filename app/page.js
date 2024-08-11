'use client'

import { Box, Button, Stack, TextField, createTheme, ThemeProvider, Typography} from '@mui/material'
import { useState } from 'react'

export default function Home() {
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'green',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: 'green',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'green',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'green',
            },
            '& .MuiInputLabel-shrink': {
              color: 'green',
            },
            '& .MuiOutlinedInput-input': {
              color: 'white', // Text color inside the input
            },
          },
        },
      },
    },
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the DocFind support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
  
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ background: "linear-gradient(0deg, rgba(51,56,56,1) 0%, rgba(40,42,52,1) 73%)"}}
    >
      <Box
        width="100%"
        color="white"
        p={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
        boxShadow={3}
        mb={10}
      >
        <Typography variant="h4">
          Welcome to DocFind Customer Support
        </Typography>
      </Box>
      <Stack //main stack that contains everything
        direction={'column'}
        width="800px"
        height="700px"
        p={2}
        spacing={3}
        mb={10}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'success.main'
                    : 'secondary.light'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
      
      <ThemeProvider theme={theme}>

      <TextField
        label="Message"
        focused
        color="success"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'green',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'green',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'green',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'green',
          },
          '& .MuiInputLabel-shrink': {
            color: 'green',
          },
          '& .MuiOutlinedInput-input': {
            color: 'white', // Text color inside the input
          },
        }}
      >
      </TextField>
      </ThemeProvider>

          <Button variant="contained" onClick={sendMessage} color="success">
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}