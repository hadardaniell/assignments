import { Box, Card, CardContent, Typography } from '@mui/material';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { colors } from '../../../assets/_colors'; // הפלטה שהגדרת
import { AnimatedLetters } from './animated-text';

export const AuthPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            minHeight="100vh"
            alignItems="center"
            sx={{
                backgroundColor: colors.YELLOW[500],
                width: '100%'
            }}
        >
            {/* צד שמאל - כרטיס */}
            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Card sx={{ width: 400, padding: 3, borderRadius: 3, boxShadow: 0 }}>
                    <CardContent>
                        <Outlet /> 
                    </CardContent>
                </Card>
            </Box>

            {/* צד ימין - כיתוב */}
            <Box
                flex={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <Typography variant="h2" sx={{
                    color: 'white', textAlign: 'center', px: 3,
                    display: 'flex', flexDirection: 'column', gap: 1,
                    alignItems: 'baseline',
                    height: '100%',
                    justifyContent: 'end',
                    lineHeight: 0.9,

                }}>
                    <AnimatedLetters text="Let's" />
                    <AnimatedLetters text="Make Some" />
                    <AnimatedLetters text="Fooooooood" />
                </Typography>
            </Box>
        </Box >
    );
};
