import { Button, TextField, Typography, Box, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { grey } from "@mui/material/colors";
import '@fontsource/heebo/300.css';
import '@fontsource/heebo/400.css';
import '@fontsource/heebo/500.css';
import '@fontsource/heebo/600.css';

interface LoginComponentProps {
  navigate: ReturnType<typeof useNavigate>; // הדרך הנכונה להגדיר את סוג navigate
}

export const LoginComponent = ({ navigate }: LoginComponentProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" textAlign="center"
      sx={{ fontSize: 22, fontWeight: 600}}>זריז להתחבר</Typography>
      <TextField label="אימייל" variant="outlined" fullWidth
      inputProps={{ dir: "rtl" }}/>
      <TextField label="סיסמה" type="password" variant="outlined" fullWidth
      inputProps={{ dir: "rtl" }}/>
      <Button variant="outlined" fullWidth
      dir='rtl'
      sx={{height: 48}}>התחברות בעזרת Google</Button>
      <Button variant="contained" color="primary" fullWidth
      sx={{ color: grey[900], 
        height: 48, 
        fontFamily: "Heebo", 
        fontWeight: 500,
        fontSize: '1.1rem'
      }}>
        התחברות
      </Button>
      <Button variant="text" onClick={() => navigate('/auth/register')}>
        אין לכם חשבון? להרשמה לחצו
      </Button>
    </Box>
  );
};
