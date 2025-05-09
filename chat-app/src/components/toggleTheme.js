'use client'

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import { Box, Fade, Slide } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
export default function ToggleTheme() {

    const [checked, setChecked] = useState(true)
    const [buttonColor, setButtonColor] = useState('light') // use different state here to change the color of the button in different time

    const containerRef = useRef()

    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {

                return savedTheme;
            } else {

                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
        }
        return 'light';
    });

    const toggleThemeMode = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')

        setChecked(false)
        setTimeout(() => {
            setButtonColor(buttonColor === 'light' ? 'dark' : 'light')

            setChecked(true)
        }, 300)
    }

    //call this function when theme is updated, if these are in the toggle function, it is not working when initialization
    useEffect(() => {
        //this attribute is the actual one which changes the theme
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
        setButtonColor(theme);
    }, [theme])

    return (
        <Slide
            direction={'down'}
            in={checked}
            mountOnEnter
            container={containerRef.current}
        >
            <Box>
                <Fade in={checked}>
                    <Box
                        ref={containerRef}
                        onClick={toggleThemeMode}
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        sx={{
                            background: buttonColor === 'light' ? '#005e9f' : '#f9ef9d',
                            borderRadius: '12%',
                            cursor: 'pointer', // the cursor changed
                            '&:hover': {
                                background: buttonColor === 'light' ? '#1265ba' : '#e6d77c' // 根据主题模式调整颜色
                            }
                        }}
                    >
                        {/* <Switch onChange={toggleThemeMode} />
                        {theme === "dark" ? <DarkModeIcon /> : <WbSunnyIcon />} */}

                        <Box
                            onClick={toggleThemeMode}
                            sx={{
                                display: 'flex',
                                color: buttonColor === 'light' ? '#ffffff' : '#000000',
                                borderRadius: '12%',
                                width: '36px',
                                height: '36px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            {buttonColor === 'light' ? (
                                <DarkModeIcon />
                            ) : (
                                <LightModeOutlinedIcon />
                            )}
                        </Box>
                    </Box>
                </Fade>
            </Box>
        </Slide>
    )
}
