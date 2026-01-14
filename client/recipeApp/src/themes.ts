import { createTheme } from '@mui/material/styles';
import { colors } from './assets/_colors';


export const theme = createTheme({
    direction: "rtl",
    typography: { fontFamily: "Heebo, Open-Sans" },
    palette: {
        primary: {
            main: colors.PINK[500],
            light: colors.PINK[300],
            dark: colors.PINK[600],
            contrastText: '#fff',
            ...colors.PINK, // מאפשר שימוש ב-100-900 ידנית
        },
        secondary: {
            main: colors.YELLOW[500],
            light: colors.YELLOW[300],
            dark: colors.YELLOW[600],
            contrastText: '#000',
        },
        grey: colors.GREY,
        background: {
            //   default: colors.PINK[500], // הרקע של הדף
            paper: '#fff',                // רקע של כרטיסים
        },
    },
});
