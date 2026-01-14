import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/600.css';

import type { AuthResponse, LoginDTO } from '../auth.types';
import { authApi } from '../auth.api';

export const LoginComponent = () => {
  const navigate = useNavigate();

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
      navigate('/');
    } catch (error) {
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
