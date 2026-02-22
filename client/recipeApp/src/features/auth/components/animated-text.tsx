import React from 'react';
import { Box, keyframes } from '@mui/material';
import { colors } from '../../../assets/_colors'; 

  const wobble = keyframes`
    0% { transform: translateX(0); }
    12.5% { transform: translateX(-4px); }
    25% { transform: translateX(4px); }
    37.5% { transform: translateX(-3px); }
    50% { transform: translateX(3px); }
    62.5% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
    87.5% { transform: translateX(-1px); }
    100% { transform: translateX(0); }
  `;


interface AnimatedLettersProps {
    text: string;
}

export const AnimatedLetters: React.FC<AnimatedLettersProps> = ({ text }) => {
    const letters = text.split('');

    const getRandomColor = () => {
        const keys = Object.keys(colors.COLORFUL) as unknown as (keyof typeof colors.COLORFUL)[];
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return colors.COLORFUL[randomKey];
    };

    return (
        <Box display="flex" gap={0.5}>
            {letters.map((char, idx) => (
                <Box
                    key={idx}
                    component="span"
                    sx={{
                        display: 'inline-block',
                        color: colors.BROWNKITCHEN.brownie,
                        fontWeight: 800,
                        transition: 'all 0.3s cubic-bezier(0.6, 0.4, 0, 1)',
                        fontSize: 'clamp(60px, 12vw, 100px)',
                        fontFamily: "Inter, sans-serif",
                        letterSpacing: '-0.05em',
                        fontVariationSettings: '"wght" 800',
                        '&:hover': {
                            color: getRandomColor(),
                            animation: `${wobble} 1s ease`, 
                        },
                    }}
                >
                    {char}
                </Box>
            ))}
        </Box>
    );
};
