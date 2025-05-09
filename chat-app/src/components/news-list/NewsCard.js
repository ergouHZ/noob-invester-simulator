"use client";

import { Avatar, CardHeader, Popover } from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const cardMaxWidth = 250;

export default function NewsCard({
    url,
    image,
    description,
    title,
    source,
    publishAt
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink', 'cyan'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const openNewsUrl = (
        url,
        event
    ) => {
        event.preventDefault()
        event.stopPropagation()
        if (url) {
            window.open(url)
        }
    }
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Card sx={{
            minWidth: cardMaxWidth,
            padding: '4px',
            backgroundColor: 'var(--background)'
        }}
            onClick={event => openNewsUrl(url, event)}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            variant="contained"
        >

            <CardMedia
                component="img"
                width={cardMaxWidth}
                image={image ? image : "https://www.skinnytaste.com/wp-content/uploads/2025/04/Air-Fryer-Asparagus-9.jpg"}
                alt="Image"
                sx={{
                    maxHeight:'320px'
                }}
            />

            <div>
                <Typography variant="body2" maxWidth={cardMaxWidth}
                    sx={{
                        color: 'var(--foreground)'
                    }}
                >
                    {title ? title : "title"}
                </Typography>
            </div>

            {/* 悬浮部分 */}
            <Popover
                id="mouse-over-popover"
                sx={{
                    pointerEvents: 'none',
                    minWidth: '2700px'
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: colors[String(source).length % colors.length] }} aria-label="recipe">
                            {String(source)[0]}
                        </Avatar>
                    }
                    title={source}
                    subheader={publishAt}
                />
                <Typography sx={{ p: 1, width: '28vw', padding: 2 }}>{description}</Typography>
            </Popover>

        </Card>
    );
}
