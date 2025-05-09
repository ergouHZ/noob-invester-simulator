import SendIcon from '@mui/icons-material/Send'
import {
    Box,
    Button,
    CircularProgress,
    InputAdornment,
    Stack
} from '@mui/material'
import { blue } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import { useState } from 'react'

const ChatInput = ({ onQuery, loading }) => {
    const [message, setMessage] = useState('')
    const [inputError, setInputError] = useState(false)

    const handleSubmit = () => {
        if (message.trim() === '') {
            return
        }
        //如果输入太长
        if (message.length > 1000) {
            setInputError(true)
            quitError()
            return
        }
        setMessage(message)
        onQuery(message)
        setMessage('')
    }

    const quitError = () => {
        setTimeout(() => {
            setInputError(false)
        }, 5000)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey || event.ctrlKey) return
            event.preventDefault()
            handleSubmit()
        }
    }

    const loadingShader = (
        <CircularProgress
            size={30}
            sx={{
                color: blue[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px'
            }}
        />
    )

    return (
        <Box className='input-container'>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <TextField
                    error={inputError}
                    fullWidth
                    variant='outlined'
                    value={message}
                    label='Search Query'
                    multiline
                    onKeyDown={handleKeyPress}
                    helperText={inputError ? 'Query too long' : null}
                    placeholder='What research articles do you need?'
                    minRows={1}
                    maxRows={8}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderRadius: '20px',
                                borderWidth: '2px'
                            },
                            '&:hover fieldset': {
                                borderWidth: '2.5px', // borders when hovering
                                borderColor: '#757ce8'
                            },
                            '&.Mui-focused fieldset': {
                                borderWidth: '2px' // borders when focusing
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'var(--foreground)' //label color
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: 'var(--foreground)',
                            opacity: 0.55 //
                        },
                        "& .MuiInputBase-input": {
                            color: 'var(--foreground)', // use input color
                        },
                    }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Box>
                                        <Button
                                            disabled={loading}
                                            variant='contained'
                                            endIcon={<SendIcon />}
                                            onClick={() => {
                                                handleSubmit()
                                            }}
                                        >
                                            {loading && loadingShader}
                                            SEND
                                        </Button>
                                    </Box>
                                </InputAdornment>
                            )
                        }
                    }}

                    onChange={e => setMessage(e.target.value)}
                />
            </Stack>
        </Box>
    )
}

export default ChatInput
