import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RegisterComponentProps {
  navigate: ReturnType<typeof useNavigate>; // סוג נכון
}

export const RegisterComponent = ({ navigate }: RegisterComponentProps) => {
  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h4" textAlign="center">Register</Typography>
      <TextField label="Username" variant="outlined" fullWidth />
      <TextField label="Email" variant="outlined" fullWidth />
      <TextField label="Password" type="password" variant="outlined" fullWidth />
      <TextField label="Confirm Password" type="password" variant="outlined" fullWidth />
      <Button variant="contained" color="primary" fullWidth>
        Register
      </Button>
      <Button variant="text" onClick={() => navigate('/auth/login')}>
        Already have an account? Login
      </Button>
    </Box>
  );
};
