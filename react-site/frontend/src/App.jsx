import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, responsiveFontSizes } from '@mui/material';
import MainTemplate from './pages/MainTemplate';
import NotFound from './pages/NotFound';
import ErrorBoundary from './ErrorBoundary.jsx'
import AppError from './AppError.jsx';
import Home from './pages/Home';
import About from './pages/About';

const rootElement = document.getElementById('root');

function App() {
  const theme = responsiveFontSizes(createTheme({
    palette: {
      },
      typography: {
          fontFamily: "Montserrat, sans-serif",
      },
      components: {
          MuiSwitch: {
              defaultProps: {
                  color: "info"
              }
          },
          MuiPopover: {
              defaultProps: {
                  container: rootElement
              }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: 'none',
              }
            }
          },
          MuiPopper: {
              defaultProps: {
                  container: rootElement
              }
          },
          MuiDialog: {
              defaultProps: {
                  container: rootElement
              }
          },
          MuiModal: {
              defaultProps: {
                  container: rootElement
              }
          }
      }
  }));

  const AppRouter = createBrowserRouter(createRoutesFromElements([
    <Route path='/' element={<MainTemplate />} errorElement={<AppError />} >
      <Route index element={<Home />} errorElement={<AppError />} />,
      <Route path='about' element={<About />} />,
    </Route>,
    <Route path="*" element={<NotFound />} />
  ]));

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <ErrorBoundary fallback={<AppError />}>
          <RouterProvider router={AppRouter} />
        </ErrorBoundary>
      </ThemeProvider>
    </>
  )
}

export default App;
