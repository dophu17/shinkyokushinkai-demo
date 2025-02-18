import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import LinkIcon from '@mui/icons-material/Link';
import UserPage from './pages/UserPage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'login',
    title: 'Login',
    icon: <LinkIcon />,
    to: '/login'
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    to: '/dashboard'
  },
  {
    segment: 'users',
    title: 'Users',
    icon: <DashboardIcon />,
    to: '/users'
  },
  {
    segment: 'news',
    title: 'News',
    icon: <DescriptionIcon />,
    to: '/news'
  }
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  console.log('pathname', pathname);
  if (pathname === '/users') {
    return <UserPage />;
  }
  if (pathname === '/news') {
    return <NewsPage />;
  }
  if (pathname === '/login') {
    return <LoginPage />;
  }

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

/**
 * @typedef {Object} DemoProps
 * @property {function} [window] - Injected by the documentation to work in an iframe.
 */

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigation, setNavigation] = React.useState(NAVIGATION);
  
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('token', token);
    if (token && location.pathname === '/login') {
      navigate('/dashboard');
    } else if (!token && location.pathname !== '/login') {
      navigate('/login');
    }

    // Filter navigation items based on token
    const filteredNavigation = NAVIGATION.filter(item => {
      if (token) {
        // When logged in, show all items except login
        return item.segment !== 'login';
      } else {
        // When not logged in, show only login
        return item.segment === 'login' || item.kind === 'header';
      }
    });
    setNavigation(filteredNavigation);
  }, [navigate, location]);

  const handleNavigation = React.useCallback((event) => {
    if (typeof event === 'string') {
      navigate(event);
    } else if (event?.to) {
      navigate(event.to);
    }
  }, [navigate]);

  return (
    <AppProvider
      navigation={navigation}
      router={{
        pathname: location.pathname,
        navigate: handleNavigation
      }}
      theme={demoTheme}
      window={window}
    >
      <DashboardLayout>
        <DemoPageContent pathname={location.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
