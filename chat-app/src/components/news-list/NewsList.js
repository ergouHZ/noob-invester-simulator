'use client';
import { getTimestampDaysAndHoursAgo } from '@/utils/customTime';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Snackbar } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useEffect, useRef, useState } from 'react';
import { fetchLabelAnalysisKeywords, fetchNewsByFilters } from '../../api/api';
import ToggleTheme from '../toggleTheme';
import NewsCard from './NewsCard';



export default function NewsList({ onUpdateLabels }) {
    const [cards, setCards] = useState([]);            //新闻的数据组
    const [startTime, setStartTime] = useState(getTimestampDaysAndHoursAgo(8, 0));    //搜索新闻的起始时间，注意api有24小时延迟
    const [startTimeType, setStartTimeType] = useState(8); // 1/2/8/31 用于正确显示选择菜单，时间戳无法显示
    const [isHeadline, setIsHeadline] = useState(false)  //是否获取头条新闻
    const [currentPage, setCurrentPage] = useState(1)  //当前数据库页数
    const [totalNews, setTotalNews] = useState(999)  //当前类别新闻总数
    const [openSnack, setOpenSnack] = useState(false); //“没有更多文章的提示”
    const [initialFetchDone, setInitialFetchDone] = useState(false)
    const containerRef = useRef(null);
    const pageSize = 20; //默认每次请求数量

    useEffect(() => {
        setCards([])
        if (currentPage !== 1) {
            setCurrentPage(1);
            onHandleFetchNewsByFilters();
        } else {
            if (initialFetchDone) {
                onHandleFetchNewsByFilters();
            }
        }
    }, [startTime, isHeadline]);

    useEffect(() => {
        // 避免在页面初始化时多次请求
        if (currentPage === 1 && !initialFetchDone) {
            onHandleFetchNewsByFilters();
            setInitialFetchDone(true);
        } else if (currentPage !== 1) {
            onHandleFetchNewsByFilters();
        }
    }, [currentPage]);

    function onHandleFetchNewsByFilters() {
        fetchNewsByFilters(startTime, isHeadline, currentPage, pageSize).then(
            data => {
                const uniqueCards = [];
                const ids = new Set();
                //再过滤一边重复元素
                for (const item of data.data) {
                    if (!ids.has(item.id)) {
                        ids.add(item.id)
                        uniqueCards.push(item)
                    }
                }
                setCards(prevCards => {
                    const updated = [...prevCards, ...uniqueCards]
                    return updated
                })
                setTotalNews(data.total)
            }
        );
    }

    function loadMore() {
        if (currentPage * pageSize < totalNews) {
            setCurrentPage(prevPage => prevPage + 1)
        } else {

        }
    }

    useEffect(() => {
        //如果不再有更多结果，不在触发监听
        if (currentPage * pageSize >= totalNews) {
            setOpenSnack(true)
            return
        }
        const container = containerRef.current;

        const handleScroll = () => {
            if (!container) return;
            if (container.scrollHeight - container.scrollTop <= container.clientHeight + 80) {
                loadMore();
            }
        };
        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage]);

    const handleChangeStartTime = (event) => {
        const dayUnit = event.target.value
        if (dayUnit === 1) {
            //获取1小时之前的新闻，但实际上有延迟，因此是24h+1h
            setStartTime(getTimestampDaysAndHoursAgo(1, 1))
        } else {
            setStartTime(getTimestampDaysAndHoursAgo(dayUnit, 0))
        }
        setStartTimeType(dayUnit)
    };

    const handleChangeIsHeadline = (event) => {
        const valueUnit = event.target.value
        setIsHeadline(valueUnit)
    }

    const onHandleAnalysis = () => {
        //生成文本蔟类
        onUpdateLabels(fetchLabelAnalysisKeywords(cards))//传数据到主页面
    }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false);
    };
    //snack bar button
    const action = (
        <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackClose}
        >
            <CloseIcon fontSize="small" />
        </IconButton>

    );

    return (
        <Box
            ref={containerRef}
            className="card-list"
            sx={{
                maxHeight: "96vh",
                overflowY: "scroll",
            }}
        >
            <Box display="flex"
                flexDirection="row"
                sx={{
                    position: 'stikcy',
                    color: 'var(--foreground)',
                    gap: 2,

                }}
                alignItems='center'
                justifyContent='center'
            >

                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label"
                        sx={{ color: 'var(--foreground)', }}
                    >Published From</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={startTimeType}
                        label="Published From"
                        onChange={handleChangeStartTime}
                        sx={{ color: 'var(--foreground)', }}
                    >
                        <MenuItem value={1}>Hour ago</MenuItem>
                        <MenuItem value={2}>Day ago</MenuItem>
                        <MenuItem value={8}>Week ago</MenuItem>
                        <MenuItem value={31}>Month ago</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth variant="standard">
                    <InputLabel id="demo-simple-select-label"
                        sx={{ color: 'var(--foreground)', }}
                    >Top Type
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={isHeadline}
                        label="Published From"
                        onChange={handleChangeIsHeadline}
                        sx={{ color: 'var(--foreground)', }}
                    >
                        <MenuItem value={false}>everything</MenuItem>
                        <MenuItem value={true}>Top headlines</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={onHandleAnalysis}>Analyse</Button>
                <ToggleTheme />
            </Box>
            <Box
                sx={{
                    columnCount: 2,
                    columnGap: '8px',
                }}
            >
                {cards.map((card, index) => (
                    <NewsCard
                        key={index}
                        url={card.url}
                        image={card.urlToImage}
                        description={card.description}
                        title={card.title}
                        source={card.source}
                        publishAt={card.publishedAt}
                    />
                ))}
            </Box>

            <Snackbar
                open={openSnack}
                autoHideDuration={6000}
                onClose={handleSnackClose}
                message="No more articles"
                action={action}
            />
        </Box>

    );
}