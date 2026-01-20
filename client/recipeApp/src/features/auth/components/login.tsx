import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/600.css';
import { useAuth } from '../../../context/auth.context.tsx';
import type { AuthResponse, LoginDTO } from '../../../types/auth.types.ts';
import { authApi } from '../../../data-access/auth.api';

export const LoginComponent = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);


    const [form, setForm] = useState<LoginDTO>({
        email: '',
        password: '',
    });

    const handleLogin = async () => {
        if (!form.email || !form.password) return;

        try {
            const res: AuthResponse = await authApi.login(form);
            localStorage.setItem("token", res.token);
            console.log('user:', res);
            setUser(res.user); 
            navigate('/profile');
        } catch (error) {
            if(error.response?.data?.code === 'INVALID_CREDENTIALS') {
                setErrorMessage("אימייל או סיסמה שגויים");
            }
            console.error('login failed', error);
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} dir="rtl">
            <Typography variant="h4" textAlign="center" sx={{ fontSize: 22, fontWeight: 600 }}>
                יאללה, רעבים?
            </Typography>

            <TextField
                label="אימייל"
                fullWidth
                value={form.email}
                onChange={(e) =>
                    setForm(prev => ({ ...prev, email: e.target.value }))
                }
            />

            <TextField
                label="סיסמה"
                type="password"
                fullWidth
                value={form.password}
                onChange={(e) =>
                    setForm(prev => ({ ...prev, password: e.target.value }))
                }
            />

            <Button variant="outlined" fullWidth sx={{ height: 48 }}>
                התחברות בעזרת Google <FcGoogle size={20} style={{ marginRight: 8 }} />
            </Button>
            {errorMessage && (<Typography color="error" variant="body2">{errorMessage}</Typography>)}
            <Button
                variant="contained"
                fullWidth
                sx={{ color: grey[900], height: 48 }}
                onClick={handleLogin}
            >
                התחברות
            </Button>

            <Button variant="text" onClick={() => navigate('/auth/register')}>
                אין לכם חשבון? להרשמה לחצו
            </Button>
        </Box>
    );
};
