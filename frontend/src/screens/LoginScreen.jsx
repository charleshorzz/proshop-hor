import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify'
 
const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Destruturing to obtain data
    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    //search params
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        } 
    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            // unwrap the resolved value in promise
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate(redirect)
        } catch (error) {
            // Put ? to show error even it is undefined
            toast.error(error?.data?.message || error.error);
        }
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>

            <Form onSubmit={submitHandler}>
                <FormGroup controlId='email' className='my-3'>
                    <FormLabel>
                        Email Address
                    </FormLabel>
                    <FormControl type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}>
                    </FormControl>
                </FormGroup>

                <FormGroup controlId='password' className='my-3'>
                    <FormLabel>
                        Password
                    </FormLabel>
                    <FormControl type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}>
                    </FormControl>
                </FormGroup>

                <Button type='submit' variant='primary' className='mt-2' disabled= { isLoading }>
                    Sign In
                </Button>

                { isLoading && <Loader />}
            </Form>

            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={ redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </FormContainer>
    )
}

export default LoginScreen
