/* REACT */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Grid, Header, Input, Modal } from 'semantic-ui-react'

/**
 * <AccountInformation  store
 *                      handleUpdate
 *                      handleDelete />
 * 
 * @prop { object } store - store object
 * @prop { function } handleUpdate - function to update store
 * @prop { function } handleDelete - function to delete store
 */
function AccountInformation(props) {
    const { store } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showDelete, setShowDelete] = useState(false);

    /**
     * This function sets initial data.
     */
    const setData = () => {
        setEmail(store.email);
        setPassword('');
        setConfirmPassword('');
    }

    useEffect(setData, [store]);

    /**
     * This function handles updating email.
     */
    const handleUpdateEmail = () => {
        let storeClone = {...store};
        storeClone.email = email;
        props.handleUpdate(storeClone, false);
    }

    /**
     * This function handles updating email.
     */
    const handleUpdatePassword = () => {
        let storeClone = {...store};
        storeClone.password = password;
        props.handleUpdate(storeClone, true);
    }

    /**
     * This function handles deleting account.
     */
    const handleDeleteAccount = () => {
        props.handleDelete(store);
        setShowDelete(false);
    }

    return (
        <>
            <Grid
                className='web-grid'
                relaxed
                stackable
                columns='equal'>
                <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                        <Header as='h3' content='Account Information' />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign='bottom'>
                    <Grid.Column>
                        <strong><Form.Field label='Email Address' /></strong>
                        <Input
                            type='email'
                            fluid
                            placeholder='Email Address'
                            value={email}
                            onChange={(event, { value }) => setEmail(value)} />
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button
                            className='update-account'
                            floated='right'
                            content='Update Email'
                            disabled={email === store.email}
                            onClick={handleUpdateEmail} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row verticalAlign='bottom'>
                    <Grid.Column>
                        <strong><Form.Field label='New Password' /></strong>
                        <Input
                            type='password'
                            fluid
                            placeholder='New Password'
                            value={password}
                            onChange={(event, { value }) => setPassword(value)} />
                        <br />
                        <strong><Form.Field label='Confirm New Password' /></strong>
                        <Input
                            type='password'
                            fluid
                            placeholder='Confirm New Password'
                            value={confirmPassword}
                            onChange={(event, { value }) => setConfirmPassword(value)} />
                    </Grid.Column>
                    <Grid.Column textAlign='right'>
                        <Button
                            className='update-account'
                            floated='right'
                            content='Update Password'
                            disabled={password === '' || confirmPassword === '' || password !== confirmPassword}
                            onClick={handleUpdatePassword} />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign='center'>
                        <Button
                            className='delete-button'
                            type='button'
                            content='Delete Account'
                            onClick={() => setShowDelete(true)} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Modal
                className='web-modal'
                open={showDelete}
                onClose={() => setShowDelete(false)}
                closeOnDimmerClick={false}
                closeOnEscape={false}
                size='mini'>
                <Modal.Header className='modal-headers'>Delete Account</Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete your account?
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        type='button'
                        className='modal-buttons'
                        floated='right'
                        content='Delete'
                        onClick={handleDeleteAccount} />
                    <Button 
                        type='button'
                        floated='right'
                        content='Cancel'
                        onClick={() => setShowDelete(false)} />
                </Modal.Actions>
            </Modal>
        </>
    )
}

AccountInformation.propTypes = {
    store: PropTypes.object,
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func
}

export default AccountInformation;