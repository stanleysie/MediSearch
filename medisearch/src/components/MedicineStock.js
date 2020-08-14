/* REACT */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Grid, Header, Input, Label, List, Responsive } from 'semantic-ui-react'

import _ from 'lodash'

/**
 * <MedicineStock   store />
 * 
 * @prop { object } store - store object
 */
function MedicineStock(props) {
    const { store } = props;
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP'
    });

    /**
     * This function sets initial data.
     */
    const setData = () => {
        let list = _.sortBy(store.products, ['name']);
        setProducts(list);
    }

    useEffect(setData, [store]);

    return (
        <Grid
            className='web-grid'
            relaxed
            columns='equal'>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h3' content='Medicine Stocks' />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Input
                        icon='search'
                        placeholder='Enter medicine name'
                        fluid
                        value={search}
                        onChange={(event, { value }) => setSearch(value)} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                <List divided relaxed>
                    {(
                        search === '' ? products
                        : products.filter(med => med.name.toLowerCase().includes(search.toLowerCase()))
                    ).map((val, index) => (
                        <List.Item key={index}>
                            <Grid
                                className='web-grid'
                                relaxed
                                columns='equal'
                                verticalAlign='middle'>
                                <Grid.Row className='compact-element'>
                                    <Grid.Column className='compact-element'>
                                        <List.Header>{val.name}</List.Header>
                                        <List.Description>{val.description}</List.Description>
                                        <Responsive as={React.Fragment} maxWidth={Responsive.onlyMobile.maxWidth}>
                                            <br />
                                            <Label
                                                className='price-tag'
                                                content={formatter.format(val.price)}
                                                size='medium' />
                                            <Label
                                                className='price-tag'
                                                content={`Stock: ${val.stock}`}
                                                size='medium' />
                                        </Responsive>
                                    </Grid.Column>
                                    <Responsive 
                                        as={Grid.Column}
                                        minWidth={Responsive.onlyTablet.minWidth}
                                        className='compact-element'
                                        textAlign='right'>
                                            <Label
                                                className='price-tag'
                                                content={formatter.format(val.price)}
                                                size='medium'
                                                horizontal={true} />
                                            <Label
                                                className='price-tag'
                                                content={`Stock: ${val.stock}`}
                                                size='medium'
                                                horizontal={true} />
                                    </Responsive>
                                </Grid.Row>
                            </Grid>
                        </List.Item>
                    ))}
                    {(
                        search === '' ? products
                        : products.filter(med => med.name.toLowerCase().includes(search.toLowerCase()))
                    ).length === 0 ? 
                        <div className='not-found'>
                            <strong>{'No medicines found.'}</strong>
                        </div>
                    : null}
                </List>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

MedicineStock.propTypes = {
    store: PropTypes.object
}

export default MedicineStock;