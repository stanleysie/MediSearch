/* REACT */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useGeneralContext } from '../utils/context'
import { Button, Form, Grid, Header, Input, Responsive, Segment } from 'semantic-ui-react'
import { NotificationManager } from 'react-notifications'

/* LIBRARIES */
import { API } from '../utils/API'

/* COMPONENTS */
import Footer from '../components/Footer'

/**
 * <SignUp  updateLoading />
 * 
 * @prop { function } updateLoading - function to update loading state
 */
function SignUp(props) {
    const { dispatch } = useGeneralContext();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    /**
     * This function handles initial setup.
     */
    const setup = () => {
        props.updateLoading(false);
        document.getElementById('username-field').focus();
    }

    useEffect(setup, []);

    /**
     * This function handles user register validation.
     */
    const handleRegister = () => {
        if(password.trim() !== confirmPassword.trim()) {
            NotificationManager.error('Passwords do not match!', 'Error', 2000);
            document.getElementById('password-field').focus();
            setPassword('');
            setConfirmPassword('');
        } else {
            setLoading(true);
            let data = new URLSearchParams({
                username,
                email,
                password
            })
            API.register(data, (response) => {
                if(response.success) {
                    NotificationManager.success(response.message, 'Success', 2000);
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    dispatch({ 
                        type: 'login',
                        value: response.data.username
                    })
                    history.push('/profile');
                }
                setLoading(false);
            })
        }
    }

    /**
     * This function handles redirecting user to login page.
     */
    const handleLogin = () => {
        dispatch({
            type: 'setMenu',
            value: 'login'
        })
        history.push('/login');
    }

    return (
        <Grid
            className='page-content'
            relaxed
            columns='equal'
            centered
            verticalAlign='middle'>
            <Grid.Row>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={5} />
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    width={3} />
                <Grid.Column>
                    <Segment
                        as={Form} 
                        basic 
                        padded='very' 
                        textAlign='center'
                        onSubmit={handleRegister}>
                        <Header 
                            as='h1' 
                            textAlign='center'
                            className='login-logo'>
                            MediSearch
                            <Header.Subheader>Register your store account.</Header.Subheader>
                        </Header>
                        <Form.Field
                            required
                            control={Input}
                            id='username-field'
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(event, { value }) => setUsername(value)} />
                        <Form.Field
                            required
                            control={Input}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(event, { value }) => setEmail(value)} />
                        <Form.Field
                            required
                            id='password-field'
                            control={Input}
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(event, { value }) => setPassword(value)} />
                        <Form.Field
                            required
                            control={Input}
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(event, { value }) => setConfirmPassword(value)} />
                        <Button
                            className='login-button'
                            loading={loading}
                            content='Sign up'
                            type='submit' />
                        <br />
                        <br />
                        <span className='sign-up-text'>Already have an account?
                            &nbsp;<span onClick={handleLogin} className='sign-up-link'>Log in</span>
                        </span>
                    </Segment>
                </Grid.Column>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    width={3} />
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={5} />
            </Grid.Row>
            <Grid.Row className='compact-element' verticalAlign='bottom'>
                <Grid.Column className='compact-element'>
                    <Footer />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

SignUp.propTypes = {
    updateLoading: PropTypes.func
}

export default SignUp;