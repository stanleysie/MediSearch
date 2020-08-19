/* REACT */
import React, { useEffect } from 'react'
import { useGeneralContext } from '..//utils/context'
import { Divider, Grid, Header, Icon, Image, Label, List, Responsive } from 'semantic-ui-react'

/* LIBRARIES */
import { API } from '../utils/API'
import _ from 'lodash'

/* COMPONENTS */
import Footer from '../components/Footer'

/* ASSETS */
import logo from '../assets/logo.png'

function StoresNearMe(props) {
    const { state, dispatch } = useGeneralContext();
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
    });

    const setup = () => {
        if(state.stores.length === 0) {
            if(window.google !== undefined) {
                API.store.get((response) => {
                    if(navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((position) => {
                            dispatch({
                                type: 'setMap',
                                value: {
                                    map: state.map,
                                    position: { lat: position.coords.latitude, lng: position.coords.longitude }
                                }
                            })
                            let list = [...response.data].map((val) => {
                                return {
                                    key: val._id,
                                    store: val,
                                    distance: parseFloat((window.google.maps.geometry.spherical.computeDistanceBetween(
                                        new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                        new window.google.maps.LatLng(val.location.lat, val.location.lng)
                                    )/1000).toFixed(3))              
                                }
                            })
                            list = _.sortBy(list, ['distance']);

                            dispatch({
                                type: 'setStores',
                                value: list
                            })
                            props.updateLoading(false);
                        })
                    }
                })
            }
        } else {
            if(state.query === '') {
                API.store.get((response) => {
                    let list = [...response.data].map((val) => {
                        return {
                            key: val._id,
                            store: val,
                            distance: parseFloat((window.google.maps.geometry.spherical.computeDistanceBetween(
                                new window.google.maps.LatLng(state.currentPosition.lat, state.currentPosition.lng),
                                new window.google.maps.LatLng(val.location.lat, val.location.lng)
                            )/1000).toFixed(3))              
                        }
                    })
                    list = _.sortBy(list, ['distance']);
    
                    dispatch({
                        type: 'setStores',
                        value: list
                    })
                    props.updateLoading(false);
                })
            }
        }
    }

    useEffect(setup, [state.map])

    return (
        <Grid
            className='page-content'
            relaxed
            columns='equal'
            verticalAlign='top'>
            {state.query !== '' ?
                <>
                    <Grid.Row className='compact-element'>
                        <Responsive 
                            as={Grid.Column} 
                            minWidth={Responsive.onlyComputer.minWidth}
                            width={4} />
                        <Responsive 
                            as={Grid.Column} 
                            maxWidth={Responsive.onlyTablet.maxWidth}
                            minWidth={Responsive.onlyTablet.minWidth}
                            width={2} />        
                        <Grid.Column>
                            <br />
                            <br />
                            <Image src={logo} centered size='small' />
                            <Header as='h3' dividing>
                                <Icon name='search' />
                                <Header.Content>Search Result</Header.Content>
                                <br />
                                <Header.Subheader>
                                    <span>{`${state.stores.length} result${state.stores.length > 1 ? 's' : ''} for `}<strong>{state.query}</strong>.</span>
                                </Header.Subheader>
                            </Header>
                        </Grid.Column>
                        <Responsive 
                            as={Grid.Column} 
                            maxWidth={Responsive.onlyTablet.maxWidth}
                            minWidth={Responsive.onlyTablet.minWidth}
                            width={2} />
                        <Responsive 
                            as={Grid.Column} 
                            minWidth={Responsive.onlyComputer.minWidth}
                            width={4} />
                    </Grid.Row>
                    <Divider section className='compact-element' />
                </>
            :
                <Grid.Row className='compact-element'>
                    <Responsive 
                        as={Grid.Column} 
                        minWidth={Responsive.onlyComputer.minWidth}
                        width={4} />
                    <Responsive 
                        as={Grid.Column} 
                        maxWidth={Responsive.onlyTablet.maxWidth}
                        minWidth={Responsive.onlyTablet.minWidth}
                        width={2} />
                    <Grid.Column>
                        <br />
                        <br />
                        <Image src={logo} centered size='small' />
                        <Header 
                            as='h3' 
                            content='Stores Near You' 
                            dividing
                            textAlign='center' />
                    </Grid.Column>
                    <Responsive 
                        as={Grid.Column} 
                        maxWidth={Responsive.onlyTablet.maxWidth}
                        minWidth={Responsive.onlyTablet.minWidth}
                        width={2} />
                    <Responsive 
                        as={Grid.Column} 
                        minWidth={Responsive.onlyComputer.minWidth}
                        width={4} />
                </Grid.Row>
            }
            <Grid.Row className='compact-element'>
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={4} />
                <Responsive 
                    as={Grid.Column} 
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={2} />
                <Grid.Column>
                    <List divided relaxed>
                        {state.stores.map((val, index) => (
                            <List.Item key={index}>
                                <Grid
                                    className='web-grid'
                                    relaxed
                                    columns='equal'>
                                    <Grid.Row verticalAlign='top'>
                                        <Grid.Column>
                                            <Header as='h3' content={`${val.store.name}`} />
                                            <Header
                                                as='h5'
                                                icon={<Icon name='time' size='mini' />}
                                                content={`${_.isEqual(val.store.openingHours, ['0', '0']) ? '24 hours' : `${val.store.openingHours[0]} - ${val.store.openingHours[1]}`}`} />
                                        </Grid.Column>
                                        <Responsive 
                                            as={Grid.Column}
                                            minWidth={Responsive.onlyComputer.minWidth}
                                            textAlign='right' width={4}>
                                            <Header as='h3' content={`${Math.round(val.distance)} km`} />
                                        </Responsive>
                                        <Responsive 
                                            as={Grid.Column}
                                            maxWidth={Responsive.onlyTablet.maxWidth}
                                            textAlign='right' width={5}>
                                            <Header as='h3' content={`${Math.round(val.distance)} km`} />
                                        </Responsive>
                                    </Grid.Row>
                                    {state.query !== '' ?
                                        <Grid.Row verticalAlign='top' className='compact-element'>
                                            <Grid.Column>
                                                <Grid
                                                    className='web-grid'
                                                    columns='equal'
                                                    relaxed
                                                    verticalAlign='top'>
                                                    <Grid.Row className='compact-element'>
                                                        <Grid.Column className='compact-element'>
                                                            <Label 
                                                                className='price-detail' 
                                                                horizontal
                                                                content={`${formatter.format(parseInt(val.store.products[0].price/10)*10)} - ${formatter.format(parseInt((val.store.products[0].price/10) + 1)*10)}`} />
                                                            <Label 
                                                                className='price-detail' 
                                                                horizontal
                                                                content={`Stock: ${val.store.products[0].stock}`} />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Grid.Column>
                                        </Grid.Row>
                                    : null}
                                    <Grid.Row>
                                        <Grid.Column textAlign='right'>
                                            <a 
                                                href={val.store.location.url} 
                                                rel="noopener noreferrer"
                                                target='_blank'>
                                                See directions in Google Maps
                                            </a>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        ))}
                    </List>
                </Grid.Column>
                <Responsive 
                    as={Grid.Column} 
                    maxWidth={Responsive.onlyTablet.maxWidth}
                    minWidth={Responsive.onlyTablet.minWidth}
                    width={2} />
                <Responsive 
                    as={Grid.Column} 
                    minWidth={Responsive.onlyComputer.minWidth}
                    width={4} />
            </Grid.Row>
            <Grid.Row />
            <Grid.Row>
                <Grid.Column textAlign='center'>
                    {state.query !== '' ?
                        <span>End of search result.</span>
                    : null}
                </Grid.Column>
            </Grid.Row>
            <Grid.Row />
            <Grid.Row className='compact-element' verticalAlign='bottom'>
                <Grid.Column className='compact-element'>
                    <Footer />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

export default StoresNearMe;