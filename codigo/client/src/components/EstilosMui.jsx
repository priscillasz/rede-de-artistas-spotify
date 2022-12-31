import { createTheme } from '@mui/material/styles';

const temaBase = createTheme();

const EstilosMui = createTheme({
    typography: {
        fontFamily: [
            'Sora',
            'sans-serif'
        ].join(','),

        h3: {
            fontSize: '1.2rem',
            fontWeight: 400,
            '@media (min-width:600px)': {
                fontSize: '1.5rem',
            },
            [temaBase.breakpoints.up('md')]: {
                fontSize: '2.4rem',
            },
        },
    },
    overrides: {
        MuiTypography: {
            h1: {
                fontSize: "0.5rem",
            }
        },
    },
});

export default EstilosMui;