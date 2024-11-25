import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import Person from '@mui/icons-material/Person';
import Login from '@mui/icons-material/Login';
import Logout from '@mui/icons-material/Logout';

export default function NavBar() {
    const [ session, setSession ] = useState(false);


    const pagesToLinks = {
        Home: '',
        About: 'about',
    }

    const getAuthActionFromSessionStatus = () => {
        return session ? 'Log out' : 'Log in';
    }

    const getAuthIcon = () => {
        if (session) {
            return <Logout className='ml-1' />;
        } else {
            return <Login className='ml-1' />;
        }
    }

    const handleAuthActionClick = () => {
        setSession(session => !session);
    }

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar className='static'>
            <Container maxWidth="xl">
                <Toolbar>
                <Typography
                    variant="h6"
                    noWrap
                    className="flex-grow font-bold tracking-widest md:flex hidden"
                    color='secondary'
                >
                    <Link href="/about" className='no-underline text-inherit'>Harkness</Link> 
                </Typography>

                <Box className='flex-grow flex md:hidden'>
                    <IconButton
                    size="large"
                    aria-label="nav menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="secondary"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    className='block md:hidden'
                    >
                    {Object.keys(pagesToLinks).map((page) => (
                        <MenuItem 
                            key={page} 
                            onClick={handleCloseNavMenu}
                        >
                            <RouterLink className='no-underline text-inherit' to={`/${pagesToLinks[page]}`}>
                                <Typography className='text-center' >
                                    {page}
                                </Typography>
                            </RouterLink>
                        </MenuItem>
                    ))}
                    </Menu>
                </Box>
                <Typography
                    variant="h5"
                    noWrap
                    className="mr-2 flex flex-grow font-bold tracking-widest md:hidden"
                    color='secondary'
                >
                    <RouterLink to="/about" className='no-underline text-inherit'>Harkness</RouterLink>
                </Typography>
                <Box className='flex-grow hidden md:flex'>
                    {Object.keys(pagesToLinks).map((page) => (
                    <Button
                        key={page}
                        onClick={handleCloseNavMenu}
                    >
                        <RouterLink className='no-underline' to={`/${pagesToLinks[page]}`}>
                            <Typography className='text-center' color='primary.contrastText'>
                                {page}
                            </Typography>
                        </RouterLink>
                    </Button>
                    ))}
                </Box>

                <Box className='flex-grow-0 space-x-4'>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} className='p-0'>
                            <Avatar alt="Settings menu icon" sx={{ bgcolor: 'secondary.main' }} >
                                <Person color='secondary.contrastText' />
                            </Avatar>   
                        </IconButton>
                    </Tooltip>
                    <Menu
                    className='mt-11'
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                    >
                        <MenuItem key='AuthAction' onClick={handleAuthActionClick}>
                            <Typography className='text-center flex items-center'>
                                {getAuthActionFromSessionStatus()}
                                {getAuthIcon()}
                            </Typography>
                        </MenuItem>
                    </Menu>
                </Box>
                </Toolbar>
            </Container>
        </AppBar>
  );

}