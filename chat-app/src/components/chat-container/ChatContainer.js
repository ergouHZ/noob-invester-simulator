'use client'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : 'http://127.0.0.1:5000';
// Main chat layout. Handle the most of the services requests, and combine all the child components together
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Box, Fab, LinearProgress } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useRef, useState } from 'react';
//customized

import parseStreamEvent from '@/utils/parseStreamEvent';
import { buildAssistantContent, buildSystemPromptContentBasedOnType, buildUserContent } from '@/utils/systemPromptSytle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import './ChatContainer.css';
import ChatInput from './ChatInput';
import MessageCard from './MessageCard';
const analyseTypeColors = {
    1: '#2e7d32', // wallstreet - 绿色
    2: '#d32f2f', // Economist - 红色
    3: '#1976d2', // Politics - 蓝色
    4: '#7b1fa2', // Quantity Trader - 紫色
};

export default function ChatContainer({ articleLabels }) {
    const [loading, setLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [messages, setMessages] = useState([])
    const messageContainerRef = useRef()
    const [analyseType, setAnalyseType] = useState(2) //选择分析模式(system prompt)
    const [conversationHistory, setConversationHistory] = useState([]);//the messages list, history messages
    const [temperature, setTemperature] = useState(0.7);
    const [maxOutputTokens, setMaxOutputTokens] = useState(3548);

    const [reply, setReply] = useState("")
    const scrollToTop = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTo({
                top: messageContainerRef.current.scrollHeight,
            })
        }
    }

    //when the component is loaded, get the conversation history
    useEffect(() => {
        const storedMessages = localStorage.getItem('messages');

        if (storedMessages) {
            const messagesList = JSON.parse(storedMessages);
            setMessages(prevMessages => {
                if (JSON.stringify(prevMessages) !== JSON.stringify(messagesList)) {
                    return messagesList;
                }
                return prevMessages;
            });
        }
        setTimeout(() => {
            scrollToBottom();
        }, 350);
        setConversationHistory(prevData => {
            return [
                ...prevData,
                buildSystemPromptContentBasedOnType(analyseType), //初始化系统分析模式
            ]
        })
    }, []);

    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages))
    }, [messages])


    useEffect(() => {
        processLabels();
    }, [articleLabels]);

    const processLabels = async () => {
        let labelsData;

        if (articleLabels && typeof articleLabels.then === 'function') {
            // 等待Promise完成
            labelsData = await articleLabels;
        } else {
            labelsData = articleLabels;
        }
        handleQuery(String(labelsData));
    };

    const clearLocalMessages = () => {
        localStorage.removeItem('messages')
        setMessages([])
    }

    //本组件主要请求接口，openai流式相应
    async function handleQuery(message) {
        if (message.trim() == '') return
        setIsStreaming(true)
        setLoading(true)

        if (String(message).startsWith("{")) {
            setConversationHistory(prevData => {
                return [
                    ...prevData,
                    buildUserContent("(文章数据)"),
                ]
            })
        } else {
            setConversationHistory(prevData => {
                return [
                    ...prevData,
                    buildUserContent(message),
                ]
            })
        }
        setTimeout(() => {
            scrollToBottom();
        }, 150);

        try {
            const reqBody = {
                user_input: message,
                conversation_history: conversationHistory,
                temperature: temperature,
                max_output_tokens: maxOutputTokens
            };
            const response = await fetch(`${BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let replyContent = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunkStr = decoder.decode(value, { stream: true });

                const events = parseStreamEvent(chunkStr)

                for (const event of events) {
                    if (event.type === 'delta') {
                        // delta：实时渲染内容
                        replyContent += event.text;
                        setReply(replyContent);
                    } else if (event.type === 'done') {
                        // 完成：显示完整文本
                        replyContent = event.text;
                        setReply(replyContent);
                    }
                    scrollToBottom();
                }

            }
            setIsStreaming(false)
            setLoading(false)
            setConversationHistory(prevData => {
                return [
                    ...prevData,
                    buildAssistantContent(replyContent),
                ]
            })
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Stream fetch aborted');
            } else {
                console.error('Fetch stream error:', error);
            }
        } finally {
            setReply('') //清空流式的信息
        }

    }

    const handleChangeAnalyseType = (event) => {
        console.log("type: ", event.target.value)
        setAnalyseType(event.target.value)
        setConversationHistory(prevData => {
            return [
                buildSystemPromptContentBasedOnType(event.target.value),
                ...prevData.slice(1) // 保留历史数据，修改提示词
            ];
        });
    }

    return (
        <div className='chat-layout-main'>
        
                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label"
                        sx={{
                            color: 'var(--foreground)', '&.Mui-focused': {
                                color: analyseTypeColors[analyseType] // 聚焦时使用对应颜色
                            }

                        }}
                    >Analyse Type
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={analyseType}
                        label="Published From"
                        onChange={handleChangeAnalyseType}

                        sx={{
                            color: 'var(--foreground)',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: analyseTypeColors[analyseType], // 边框颜色
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: analyseTypeColors[analyseType], // 悬停时边框颜色
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: analyseTypeColors[analyseType], // 聚焦时边框颜色
                            },
                            '& .MuiSvgIcon-root': {
                                color: analyseTypeColors[analyseType], // 下拉图标颜色
                            },
                        }}
                    >
                        <MenuItem value={1}>wallstreet</MenuItem>
                        <MenuItem value={2}>Economist</MenuItem>
                        <MenuItem value={3}>Politics</MenuItem>
                        <MenuItem value={4}>Quantity Trader</MenuItem>
                    </Select>
                </FormControl>
      
            <CssBaseline />
            <Box className='message-container'
                ref={messageContainerRef}
                sx={{
                    backgroundColor: 'transparent',
                }}>
                <Container className='message-content-container' maxWidth='md'>
                    {conversationHistory.map((item, index) => (
                        index === 0 ? null :
                            <MessageCard
                                key={index}
                                role={item.role}
                                message={item.content}
                            />
                    ))}
                    {isStreaming ? <Box>
                        <MessageCard role="assistant" message={reply} />
                        <LinearProgress />
                    </Box>
                        : null
                    }
                </Container>
            </Box>
            <div style={{ position: 'relative', zIndex: 1 }}>
                {messages.length !== 0 ? (
                    <Fab
                        variant='extended'
                        size='small'
                        onClick={clearLocalMessages}
                        sx={{
                            position: 'absolute',
                            top: '-30px',
                            right: '36%',
                            zIndex: 2
                        }}
                    >
                        <DeleteSweepIcon sx={{ mr: 1 }} />
                        Clear context
                    </Fab>
                ) : (
                    <></>
                )}
                <div className='text-input-container'>
                    <ChatInput onQuery={handleQuery} loading={loading} />
                </div>
            </div>
        </div>
    )
}