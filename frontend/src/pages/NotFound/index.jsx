import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function NotFound() {
    return (
        <Container 
            maxWidth='xl'
            className='flex flex-col items-center justify-center text-center'
        >
            <Typography variant='h4' component='h1' className='font-light'>
                We could not find what you were looking for. It might have been moved or deleted.
            </Typography>
        </Container>
    );
}