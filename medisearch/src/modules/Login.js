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
 * <Login   updateLoading />
 * 
 * @prop { function } updateLoading - function to update loading state
 */
function Login(props) {
    const { dispatch } = useGeneralContext();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /**
     * This function handles initial setup.
     */
    const setup = () => {
        props.updateLoading(false);
        document.getElementById('username-field').focus();
    }

    useEffect(setup, []);

    /**
     * This function handles user login validation.
     */
    const handleLogin = () => {
        setLoading(true);
        let data = new URLSearchParams({
            username, password
        })
        API.login(data, (response) => {
            if(response.success) {
                NotificationManager.success(response.message, 'Success', 2000);
                dispatch({ 
                    type: 'login',
                    value: response.data.username
                })
                history.push('/profile');
            } else {
                NotificationManager.error(response.message, 'Login Failed', 2000);
                document.getElementById('username-field').focus();
            }
            setUsername('');
            setPassword('');
            setLoading(false);
        })
    }

    /**
     * This function handles redirecting user to sign up page.
     */
    const handleRegister = () => {
        dispatch({
            type: 'setMenu',
            value: 'register'
        })
        history.push('/register');
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
                        onSubmit={handleLogin}>
                        <Header 
                            as='h1' 
                            textAlign='center'
                            className='login-logo'>
                            MediSearch
                            <Header.Subheader>Manage your store account.</Header.Subheader>
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
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(event, { value }) => setPassword(value)} />
                        <Button
                            className='login-button'
                            loading={loading}
                            content='Login'
                            type='submit' />
                        <br />
                        <br />
                        <span className='sign-up-text'>Don't have an account?
                            &nbsp;<span onClick={handleRegister} className='sign-up-link'>Sign up</span>
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

Login.propTypes = {
    updateLoading: PropTypes.func
}

export default Login;