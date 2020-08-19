/* REACT */
import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Grid, Icon, Menu, Responsive } from 'semantic-ui-react'
import { useGeneralContext } from '../utils/context'

/**
 * <NavigationBar />
 */
function NavigationBar() {
    const { state, dispatch } = useGeneralContext();
    const history = useHistory();

    /**
     * This function sets initial menu.
     */
    const initial = () => {
        if(history.length === 1) {
            dispatch({
                type: 'setMenu',
                value: 'home'
            })
        }
    }

    useEffect(initial, []);

    /**
     * This function handles changing menu on navigation bar.
     * @param { event } event - onClick event
     * @param { string } name - menu name
     */
    const handleChangeMenu = (event, { name }) => {
        if(state.menu !== name) {
            dispatch({
                type: 'setMenu',
                value: name
            })
        }
    }

    return (
        <Grid
            as={Menu}
            className='navigation-bar'
            inverted
            fixed='top'
            pointing
            secondary
            relaxed
            icon='labeled'
            columns='equal'
            textAlign='center'
            verticalAlign='middle'>
            <Grid.Row>
                <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth} />
                <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: '/' }}
                        className='menu-item'
                        name='home'
                        content='MediSearch'
                        active={state.menu === 'home'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} maxWidth={Responsive.onlyMobile.maxWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: '/' }}
                        className='menu-item'
                        name='home'
                        content=''
                        icon={<Icon name='home' size='big' style={{ color: state.menu === 'home' ? '#FF9F75' : '#FFFFFF' }} />}
                        active={state.menu === 'home'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: '/stores-near-me' }}
                        className='menu-item'
                        name='stores'
                        content='Stores'
                        active={state.menu === 'stores'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} maxWidth={Responsive.onlyMobile.maxWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: '/stores-near-me' }}
                        className='menu-item'
                        name='stores'
                        content=''
                        icon={<Icon name='medkit' size='big' style={{ color: state.menu === 'stores' ? '#FF9F75' : '#FFFFFF' }} />}
                        active={state.menu === 'stores'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: state.user === null ? '/login' : '/profile' }}
                        className='menu-item'
                        name={state.user === null ? 'login' : 'profile'}
                        content={state.user === null ? 'Login' : 'My Store'}
                        active={state.menu === 'profile' || state.menu === 'login'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} maxWidth={Responsive.onlyMobile.maxWidth}>
                    <Menu.Item
                        as={Link}
                        to={{ pathname: state.user === null ? '/login' : '/profile' }}
                        className='menu-item'
                        name={state.user === null ? 'login' : 'profile'}
                        content=''
                        icon={<Icon name='user' size='big' style={{ color: state.menu === 'login' || state.menu === 'profile' ? '#FF9F75' : '#FFFFFF' }} />}
                        active={state.menu === 'profile' || state.menu === 'login'}
                        onClick={handleChangeMenu} />
                </Responsive>
                <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth} />
            </Grid.Row>
        </Grid>
    )
}

export default NavigationBar;

