import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/600.css';
import { useAuth } from '../../../context/auth.context.tsx';
import type { AuthResponse, LoginDTO } from '../../../types/auth.types.ts';
import { authApi } from '../../../data-access/auth.api';
import { GoogleLoginButton } from './google-login-button.tsx';
import { RememberMeCheckbox } from './remember-me-checkbox.tsx';
import { saveAuthTokens } from '../../../data-access/token.storage.ts';

export const LoginComponent = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [rememberMe, setRememberMe] = useState<boolean>(() => {
        return localStorage.getItem("rememberMe") === "1";
    });


    const [form, setForm] = useState<LoginDTO>({
        email: '',
        password: '',
    });

    const handleLogin = async () => {
        if (!form.email || !form.password) return;

        try {
            const res: AuthResponse = await authApi.login(form);
            saveAuthTokens({
                token: res.token,
                refreshToken: res.refreshToken,
                rememberMe,
            });
            setUser(res.user);
            navigate('/profile');
        } catch (error) {
            if (error.response?.data?.code === 'INVALID_CREDENTIALS') {
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

            <GoogleLoginButton
                onSuccess={(res) => {
                    (async () => {
                        try {
                            saveAuthTokens({
                                token: res.token,
                                refreshToken: res.refreshToken, // אם אין, זה עדיין בסדר
                                rememberMe,
                            });

                            setUser(res.user);
                            navigate("/profile");
                        } catch (e) {
                            console.error("Google auth success but me() failed:", e);
                            setErrorMessage("התחברות עם Google נכשלה. נסו שוב.");
                        }
                    })();
                }}
                onError={(msg) => setErrorMessage(msg)}
            />
            {errorMessage && (<Typography color="error" variant="body2">{errorMessage}</Typography>)}
            <Button
                variant="contained"
                fullWidth
                color="primary"
                sx={{ height: 48 }}
                onClick={handleLogin}
            >
                התחברות
            </Button>
            <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />

            <Button variant="text" onClick={() => navigate('/auth/register')}>
                אין לכם חשבון? להרשמה לחצו
            </Button>
        </Box>
    );
};
