import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { Button } from '@mui/material';

export default function About(){
    const [ message, setMessage ] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(message);
    }

    return (
        <Container className='flex flex-col justify-center items-center gap-5 mb-10'>
            <Typography 
                variant='h1'
                className='text-center font-semibold'
                color='primary'
            >
                Welcome to Harkness.
            </Typography>
            <Paper 
                className='flex flex-col p-4 h-96 w-4/5 text-center rounded-lg'
                elevation={5}
            >
                <Typography 
                    variant='h2'
                >
                    Ask more and Learn more.
                </Typography>
                <Box 
                    component='form'
                    noValidate
                    autoComplete='off'
                    className='flex gap-1 mt-auto'
                >
                    <TextField
                        label='Ask me anything'
                        variant='outlined'
                        className='w-full'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <IconButton
                        color='primary'
                        aria-label='send'
                        component='span'
                        onClick={handleSubmit}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
            <Paper 
                className='flex flex-col p-4 w-5/6 gap-10 rounded-lg'
                elevation={5}
            >
                <Typography
                    variant='h3'
                    className='text-center'
                >
                    Understanding Made Easier
                </Typography>
                <Typography
                    variant='body1'
                    className='text-center'
                >
                    Harkness is a virtual office hours system to connect professors and students. We seek to make the learning process more
                    efficient and effective in large lecture classes. Professors can upload course materials and provice students with a place to 
                    ask nuianced questions to virtual "Teaching Assistants" anytime, anywhere.
                </Typography>
                <Box
                    className='flex gap-4'
                >
                    <Paper
                        className='text-center p-4'
                        elevation={3}
                    >
                        <Typography 
                            variant='h5'
                            color='primary'
                        >
                            For Professors
                        </Typography>
                        <Typography
                            variant='body1'
                        >
                            Track students' participation, manage discussions, and gain valuable insights into classroom dynamics.
                        </Typography>
                        <Button
                            variant='contained'
                        >
                            Professors' Login
                        </Button>
                    </Paper>
                    <Paper
                        className='text-center p-4'
                        elevation={3}
                    >
                        <Typography 
                            variant='h5'
                            color='primary'
                        >
                            For Students
                        </Typography>
                        <Typography
                            variant='body1'
                        >
                            Engage meaningfully in discussions, receive feedback on your learning, and develop a deeper understanding of course material.
                        </Typography>
                        <Button
                            variant='contained'
                        >
                            Students' Login
                        </Button>
                    </Paper>
                </Box>
            </Paper>
        </Container>
    )
}