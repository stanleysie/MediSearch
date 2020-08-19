/* REACT */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useGeneralContext } from '../utils/context'
import { Form, Grid, Header, Image, Input, List, Responsive, Transition } from 'semantic-ui-react'

/* LIBRARIES */
import _ from 'lodash'
import { API } from '../utils/API'

/* COMPONENTS */
import Footer from '../components/Footer'

/* ASSETS */
import logo from '../assets/logo.png'

/**
 * <Home    updateLoading />
 * 
 * @prop { function } updateLoading - function to update loading state
 */
function Home(props) {
    const history = useHistory();
    const { state, dispatch } = useGeneralContext();
    const [stores, setStores] = useState([]);
    const [options, setOptions] = useState([]);
    const [value, setValue] = useState('');
    const [input, setInput] = useState('');
    
    /**
     * This function handles initialization of google maps.
     */
    const initialization = () => {
        props.updateLoading(true);
        setData();
    }

    /**
     * This function set up the dummy data.
     */
    const setData = () => {
        API.store.get((response) => {
            setStores(response.data);
            let list = [];
            [...response.data].forEach(val => {
                val.products.forEach(med => {
                    if(!list.includes(med.name)) {
                        list.push(med.name);
                    }
                })
            })
            setOptions(list);
            dispatch({
                type: 'setQuery',
                value: ''
            })
            props.updateLoading(false);
        })
    }

    useEffect(initialization, [])

    /**
     * This function handles searching for medical stores.
     */
    const handleSearch = () => {
        let list = [];
        [...stores].forEach(val => {
            if(val.products.some(med => med.name.toLowerCase().includes(input.toLowerCase()))) {
                val.products = [...val.products].filter(prod => prod.name.toLowerCase().includes(input.toLowerCase()));
                if(val.products[0].stock > 0) {
                    list.push({
                        store: val,
                        distance: parseFloat((window.google.maps.geometry.spherical.computeDistanceBetween(
                            new window.google.maps.LatLng(state.currentPosition.lat, state.currentPosition.lng),
                            new window.google.maps.LatLng(val.location.lat, val.location.lng)
                        )/1000).toFixed(3))
                    })
                }
            }
        })
        list = _.sortBy(list, ['distance']);
        dispatch({
            type: 'setQuery',
            value: input
        })
        dispatch({
            type: 'setStores',
            value: list
        })
        dispatch({
            type: 'setMenu',
            value: 'stores'
        })
        history.push('/stores-near-me');
    }

    return (
        <Grid
            className='page-content'
            relaxed
            columns='equal'>
            <Grid.Row verticalAlign='bottom'>
                <Grid.Column textAlign='center'>
                    <Image 
                        src={logo} 
                        size='medium' 
                        centered />
                    <Header 
                        as='h1'
                        textAlign='center'
                        className='logo'>
                        <Header.Subheader>Find medicine stores near you.</Header.Subheader>
                    </Header>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row verticalAlign='top'>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={4} />
                <Grid.Column textAlign='center'>
                    <Form onSubmit={handleSearch}>
                        <Input
                            icon={{ name: 'search', link: true, onClick: handleSearch }}
                            placeholder='Enter medicine name'
                            fluid
                            value={input}
                            onChange={(event, { value }) => {
                                setValue('');
                                setInput(value);
                            }} />
                    </Form>
                    <Transition visible={input.length > 0 && value === ''} animation='slide down'>
                        <List relaxed className='search-list'>
                            {options.filter(val => val.toLowerCase().includes(input.toLowerCase())).map((val, index) => (
                                <List.Item 
                                    key={index} 
                                    className='list-item'
                                    onClick={() => {
                                        setInput(val);
                                        setValue(val);
                                    }}>
                                    <List.Header>{val}</List.Header>
                                </List.Item>
                            ))}
                            {options.filter(val => val.toLowerCase().includes(input.toLowerCase())).length === 0 ? 
                                <List.Item>
                                    <List.Header>No result found.</List.Header>
                                </List.Item>
                            : null}
                        </List>
                    </Transition>
                </Grid.Column>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={4} />
            </Grid.Row>
            <Grid.Row className='compact-element' verticalAlign='bottom'>
                <Grid.Column className='compact-element'>
                    <Footer />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

Home.propTypes = {
    updateLoading: PropTypes.func
}

export default Home;