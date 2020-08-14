/* REACT */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useGeneralContext } from '../utils/context'
import { Button, Grid, Responsive, Tab } from 'semantic-ui-react'
import { NotificationManager } from 'react-notifications'

/* LIBRARIES */
import { API } from '../utils/API'

/* COMPONENTS */
import StoreInformation from '../components/StoreInformation'
import MedicineStock from '../components/MedicineStock'
import AccountInformation from '../components/AccountInformation'
import Footer from '../components/Footer'

/**
 * <MyStore     updateLoading />
 * 
 * @prop { function } updateLoading - function to update loading state
 */
function MyStore(props) {
    const history = useHistory();
    const { dispatch } = useGeneralContext();
    const [store, setStore] = useState(null);

    const panes = [
        {
            menuItem: 'Store',
            render: () => (
                <Tab.Pane attached={false}>
                    <StoreInformation store={store} handleUpdate={handleUpdateProfile} />
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Medicines',
            render: () => (
                <Tab.Pane attached={false}>
                    <MedicineStock store={store} />
                </Tab.Pane>
            )
        },
        {
            menuItem: 'Account',
            render: () => (
                <Tab.Pane attached={false}>
                    <AccountInformation 
                        store={store} 
                        handleUpdate={handleUpdateProfile}
                        handleDelete={handleDeleteProfile} />
                </Tab.Pane>
            )
        }
    ]

    /**
     * This function handles initial setup of the profile.
     */
    const setup = () => {
        API.getUser((response) => {
            if(response.success) {
                dispatch({
                    type: 'setUser',
                    value: response.data.username
                })
                setStore(response.data);
                props.updateLoading(false);
            } else {
                dispatch({ type: 'logout' });
                history.push('/login');
            }
        })
    }

    useEffect(setup, []);

    /**
     * This function handles updating store profile.
     * @param { object } value - store object
     * @param { boolean } password - value to determine if need to update password or not
     */
    const handleUpdateProfile = (value, password) => {
        props.updateLoading(true);
        if(password) {
            let data = new URLSearchParams({
                storeID: value._id,
                password: value.password
            })
            API.store.updatePassword(data, (response) => {
                if(response.success) {
                    NotificationManager.success(response.message, 'Success', 2000);
                    setStore(response.data);
                }
                props.updateLoading(false);
            })
        } else {
            let data = new URLSearchParams({
                store: JSON.stringify(value)
            })
            API.store.update(data, (response) => {
                if(response.success) {
                    NotificationManager.success(response.message, 'Success', 2000);
                    setStore(response.data);
                }
                props.updateLoading(false);
            })
        }
    }

    /**
     * This function handles deleting store profile.
     * @param { object } value - store object
     */
    const handleDeleteProfile = (value) => {
        props.updateLoading(true);
        let data = new URLSearchParams({
            storeID: value._id
        })
        API.store.delete(data, (response) => {
            handleLogout();
        })
    }

    /**
     * This function handles logging out user.
     */
    const handleLogout = () => {
        API.logout((response) => {
            dispatch({ type: 'logout' });
            history.push('/login');
        })
    }

    return (
        <Grid
            className='page-content'
            relaxed
            columns='equal'
            centered>
            <Grid.Row>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    width={2} />
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={3} />
                {store !== null ?
                    <Grid.Column>
                        <br />
                        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                        <br />
                        <Button
                            className='logout-button'
                            type='button'
                            floated='right'
                            icon='sign out'
                            content='Log out'
                            onClick={handleLogout} />
                    </Grid.Column>
                : null}
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={3} />
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    width={2} />
            </Grid.Row>
            <Grid.Row className='compact-element' verticalAlign='bottom'>
                <Grid.Column className='compact-element'>
                    <Footer />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

MyStore.propTypes = {
    updateLoading: PropTypes.func
}

export default MyStore;