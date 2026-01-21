import { Button, TextField, Typography, Box } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import type { AuthResponse, RegisterDTO } from '../../../types/auth.types';
import { authApi } from '../../../data-access/auth.api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const RegisterComponent = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<RegisterDTO>({
        name: "",
        email: "",
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleRegister = async () => {
        if (!form.name || !form.email || !form.password || !confirmPassword) return;
        if (form.password !== confirmPassword) {
            setErrorMessage("הסיסמאות לא תואמות");
            console.error("Passwords do not match");
            return;
        }

        try {
            const res: AuthResponse = await authApi.register(form);
            localStorage.setItem("token", res.token);
            localStorage.setItem("refreshToken", res.refreshToken);
            console.log("user:", res);
            navigate("/");
        } catch (error: any) {
            if (error.response.data.code === "EMAIL_TAKEN") {
                setErrorMessage("האימייל כבר בשימוש");
                console.error("register failed", error);
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" gap={2} dir="rtl">
            <Typography variant="h4" textAlign="center" sx={{ fontSize: 22, fontWeight: 600 }}>הרשמה</Typography>
            <TextField label="שם משתמש" variant="outlined" fullWidth
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            <TextField label="אימייל" variant="outlined" fullWidth
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            <TextField label="סיסימה" type="password" variant="outlined" fullWidth
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
            <TextField label="אימות סיסימה" type="password" variant="outlined" fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} />
            {errorMessage && (<Typography color="error" variant="body2">{errorMessage}</Typography>)}
            <Button variant="contained" color="primary" fullWidth
                onClick={handleRegister}>
                הרשמה
            </Button>
            <Button variant="text" onClick={() => navigate('/auth/login')}>
                כבר יש לכם חשבון? להתחברות לחצו
            </Button>
        </Box>
    );
};
