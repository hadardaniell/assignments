import { Button, TextField, Typography, Box } from '@mui/material';
import type { AuthResponse, RegisterDTO } from '../../../types/auth.types';
import { authApi } from '../../../data-access/auth.api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/auth.context';
import { GoogleLoginButton } from './google-login-button';
import { RememberMeCheckbox } from './remember-me-checkbox';
import { saveAuthTokens } from "../../../data-access/token.storage";


export const RegisterComponent = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [form, setForm] = useState<RegisterDTO>({
        name: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [rememberMe, setRememberMe] = useState<boolean>(() => {
        return localStorage.getItem("rememberMe") === "1";
    });

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.password || !confirmPassword) return;
        if (form.password !== confirmPassword) {
            setErrorMessage("הסיסמאות לא תואמות");
            console.error("Passwords do not match");
            return;
        }

        try {
            const res: AuthResponse = await authApi.register(form);
            saveAuthTokens({
                token: res.token,
                refreshToken: res.refreshToken,
                rememberMe,
            });
            setUser(res.user);
            navigate("/profile");
        } catch (error: any) {
            if (error.response.data.code === "EMAIL_TAKEN") {
                setErrorMessage("האימייל כבר בשימוש");
                console.error("register failed", error);
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} dir="rtl">
            <Typography variant="h4" textAlign="center" sx={{
                fontSize: 22, fontWeight: 600
            }}>הרשמה</Typography>
            <TextField label="שם משתמש" variant="outlined" fullWidth
                sx={{
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                        fontSize: "16px",
                    },
                }}
                size="small"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <TextField label="אימייל" variant="outlined" fullWidth
                sx={{
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                        fontSize: "16px",
                    },
                }}
                size="small"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            <TextField label="סיסמה" type="password" variant="outlined" fullWidth
                sx={{
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                        fontSize: "16px",
                    },
                }}
                size="small"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            <TextField label="אימות סיסמה" type="password" variant="outlined" fullWidth
                sx={{
                    "& .MuiInputLabel-root": {
                        fontSize: "14px",
                    },
                    "& .MuiInputLabel-shrink": {
                        fontSize: "16px",
                    },
                }}
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />
            {errorMessage && (<Typography color="error" variant="body2">{errorMessage}</Typography>)}
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
            <Button variant="contained" color="primary" fullWidth
                onClick={handleRegister}
                sx={{ height: 48 }}>
                הרשמה
            </Button>
            <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
            <Button variant="text" onClick={() => navigate('/auth/login')}>
                כבר יש לכם חשבון? להתחברות לחצו
            </Button>
        </Box>
    );
};
