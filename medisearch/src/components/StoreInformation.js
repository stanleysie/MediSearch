/* REACT */
import React, { useState, useEffect, createRef } from 'react'
import PropTypes from 'prop-types'
import { useGeneralContext } from '../utils/context'
import { Button, Checkbox, Form, Grid, Header, Icon, Input, List, Radio, Responsive, TextArea } from 'semantic-ui-react'
import { TimeInput } from 'semantic-ui-calendar-react'

/* LIBRARIES */
import _ from 'lodash'

/* COMPONENTS */
import ContactModal from './ContactModal'

/**
 * <StoreInformation    store
 *                      handleUpdate />
 * 
 * @prop { object } store - store object
 * @prop { function } handleUpdate - function to update store information
 */
function StoreInformation(props) {
    const { store } = props;
    const { state } = useGeneralContext();
    const [change, setChange] = useState(false);
    const [branch, setBranch] = useState(false);
    const [fullTime, setFullTime] = useState(false);
    const [formState, setFormState] = useState({
        name: '', address: '', branch: '', description: '', image: null, birPermit: null, contact: [], openingHours: []
    })
    const imageFileRef = createRef();
    const birPermitRef = createRef();

    /**
     * This function sets initial data.
     */
    const setData = () => {
        let formStateClone = {...formState};
        formStateClone.name = store.name;
        formStateClone.address = store.address;
        formStateClone.branch = store.branch;
        formStateClone.description = store.description;
        formStateClone.image = store.image;
        formStateClone.birPermit = store.birPermit;
        formStateClone.contact = [...store.contact];
        formStateClone.openingHours = [...store.openingHours];
        if(_.isEqual(formStateClone.openingHours, ['0', '0'])) {
            setFullTime(true);
            formStateClone.openingHours = ['', ''];
        }
        setFormState(formStateClone);

        if(window.google !== undefined) {
            var input = document.getElementById('search-address');
            var options = {
                types: ['address'],
            }
            let autocomplete = new window.google.maps.places.Autocomplete(input, options);
        } 
    }

    useEffect(setData, [store, state.map]);

    /**
     * This function handles updating store information.
     */
    const handleUpdate = () => {
        let storeClone = {...store};
        storeClone = {...storeClone, ...formState};
        if(fullTime) {
            storeClone.openingHours = ['0', '0'];
        }
        if(!branch) {
            storeClone.branch = '';
        }
        setChange(false);
        props.handleUpdate(storeClone, false);
    }

    /**
     * This function handles updating form fields.
     * @param { event } event - onChange event
     * @param { string } name - formState key
     * @param { string } value - new value
     */
    const handleChange = (event, { name, value }) => {
        if(name === 'address') {
            // insert search box configuration
        }

        let formStateClone = {...formState};
        formStateClone[name] = value;
        setFormState(formStateClone);
        checkStateChange(formStateClone);
    }

    /**
     * This function check for any state changes in the form.
     * @param { object } form - updated form object
     */
    const checkStateChange = (form) => {
        if(form.name === store.name &&
            form.address === store.address &&
            form.branch === store.branch &&
            form.description === store.description &&
            form.image === store.image &&
            form.birPermit === store.birPermit &&
            _.isEmpty(_.xor(form.contact, store.contact)) &&
            _.isEmpty(_.xor(form.openingHours, store.openingHours))) {
            setChange(false);
        } else {
            setChange(true);
        }
    }

    return (
        <Grid
            className='web-grid'
            relaxed
            columns='equal'>
            <Grid.Row verticalAlign='middle'>
                <Grid.Column>
                    <Header as='h3' content='Store Information' />
                </Grid.Column>
                <Grid.Column textAlign='right'>
                    <Button
                        className='update-button'
                        floated='right'
                        content='Update'
                        disabled={!change}
                        onClick={() => document.getElementById('submit-button').click()} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row>
                <Grid.Column>
                    <Form size='small' onSubmit={handleUpdate}>
                        <button id='submit-button' type='submit' hidden />
                        <Form.Field
                            required
                            control={Input}
                            type='text'
                            name='name'
                            label='Store Name'
                            placeholder='Store Name'
                            value={formState.name}
                            onChange={handleChange} />
                        <Form.Field
                            control={Input}
                            id='search-address'
                            type='text'
                            name='address'
                            label='Store Address'
                            placeholder='Make it easy for people to visit your store.'
                            value={formState.address}
                            onChange={handleChange} />
                        <Form.Field label='Branch' />
                        <Grid
                            className='web-grid'
                            relaxed
                            stackable
                            columns='equal'
                            verticalAlign='middle'>
                            <Grid.Row className='compact-element'>
                                <Grid.Column width={2} className='compact-element'>
                                    <Form.Field
                                        control={Radio}
                                        label='No'
                                        checked={!branch}
                                        onChange={() => setBranch(false)} />
                                </Grid.Column>
                                <Grid.Column width={6} className='compact-element'>
                                    <Form.Field
                                        control={Radio}
                                        label='Yes, which home branch?'
                                        checked={branch}
                                        onChange={() => setBranch(true)} />
                                </Grid.Column>
                                <Grid.Column>
                                    <Form.Field
                                        control={Input}
                                        type='text'
                                        name='branch'
                                        placeholder='Branch Name'
                                        disabled={!branch}
                                        value={formState.branch}
                                        onChange={handleChange} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <br />
                        <Form.Field
                            control={TextArea}
                            type='text'
                            name='description'
                            label='Store Description'
                            placeholder='Tell us something about your store.'
                            value={formState.description}
                            onChange={handleChange} />
                        <Form.Field label='Store Image' />
                        <input 
                            ref={imageFileRef} 
                            type='file' 
                            hidden 
                            accept='image/*'
                            onChange={(event) => {
                                let formStateClone = {...formState};
                                formStateClone.image = event.target.files[0];
                                setFormState(formStateClone);
                                checkStateChange(formStateClone);
                            }} />
                        <div className='form-wrapper'>
                            <Button
                                className='upload-button'
                                type='button'
                                icon='upload'
                                content='Upload'
                                onClick={() => imageFileRef.current.click()} />
                            {formState.image !== null ?
                                <>
                                    &nbsp;&nbsp;&nbsp;<div className='file-name'>
                                        {formState.image.name}&nbsp;
                                        <Icon 
                                            link
                                            name='x'
                                            onClick={() => {
                                                let formStateClone = {...formState};
                                                formStateClone.image = null;
                                                setFormState(formStateClone);
                                                checkStateChange(formStateClone);
                                            }} />
                                    </div>
                                </>
                            : null}
                        </div>
                        <br />
                        <Form.Field required label='BIR Permit' />
                        <input 
                            ref={birPermitRef} 
                            type='file' 
                            hidden 
                            accept='image/*,.pdf'
                            onChange={(event) => {
                                let formStateClone = {...formState};
                                formStateClone.birPermit = event.target.files[0];
                                setFormState(formStateClone);
                                checkStateChange(formStateClone);
                            }} />
                        <div className='form-wrapper'>
                            <Button
                                className='upload-button'
                                type='button'
                                icon='upload'
                                content='Upload'
                                onClick={() => birPermitRef.current.click()} />
                            {formState.birPermit !== null ?
                                <>
                                    &nbsp;&nbsp;&nbsp;<div className='file-name'>
                                        {formState.birPermit.name}&nbsp;
                                        <Icon 
                                            link
                                            name='x'
                                            onClick={() => {
                                                let formStateClone = {...formState};
                                                formStateClone.birPermit = null;
                                                setFormState(formStateClone);
                                                checkStateChange(formStateClone);
                                            }} />
                                    </div>
                                </>
                            : null}
                        </div>
                        <br />
                        <Form.Field label='Opening Hours' />
                        <Form.Group className='form-wrapper'>
                            <Form.Field
                                className='opening-hour-field'
                                control={Checkbox}
                                label='24 hours'
                                checked={fullTime}
                                onChange={() => {
                                    setFullTime(!fullTime);
                                    setChange(!change);
                                }} />
                            <Form.Field
                                required={!fullTime}
                                className='opening-hour-field'
                                control={TimeInput}
                                width={5}
                                placeholder='Opening Hour'
                                iconPosition='left'
                                animation='none'
                                clearable
                                closable
                                popupPosition='top center'
                                disableMinute
                                hideMobileKeyboard
                                disabled={fullTime}
                                value={formState.openingHours[0] || ''}
                                onChange={(event, { value }) => {
                                    let formStateClone = {...formState};
                                    formStateClone.openingHours[0] = value;
                                    setFormState(formStateClone);
                                    checkStateChange(formStateClone);
                                }} />
                            <Form.Field
                                required={!fullTime}
                                className='opening-hour-field'
                                control={TimeInput}
                                width={5}
                                placeholder='Closing Hour'
                                iconPosition='left'
                                animation='none'
                                clearable
                                closable
                                popupPosition='top center'
                                disableMinute
                                hideMobileKeyboard
                                disabled={fullTime}
                                value={formState.openingHours[1] || ''}
                                onChange={(event, { value }) => {
                                    let formStateClone = {...formState};
                                    formStateClone.openingHours[1] = value;
                                    setFormState(formStateClone);
                                    checkStateChange(formStateClone);
                                }} />
                        </Form.Group>
                        <br />
                        <Grid
                            className='web-grid'
                            relaxed
                            columns='equal'
                            verticalAlign='middle'>
                            <Grid.Row className='compact-element'>
                                <Grid.Column className='compact-element'>
                                    <Form.Field label='Contact Details' />
                                </Grid.Column>
                                <Grid.Column textAlign='right' className='compact-element'>
                                    <ContactModal
                                        type='create'
                                        formState={formState}
                                        updateFormState={setFormState}
                                        updateStateChanges={checkStateChange} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <List divided relaxed>
                            {formState.contact.map((val, index) => (
                                <List.Item key={index}>
                                    <Grid
                                        className='web-grid'
                                        relaxed
                                        columns='equal'
                                        verticalAlign='middle'>
                                        <Grid.Row className='compact-element'>
                                            <Grid.Column className='compact-element'>
                                                <List.Header>{val.name}</List.Header>
                                                <Responsive as={React.Fragment} maxWidth={Responsive.onlyMobile.maxWidth}>
                                                    <List.Description>{val.email}</List.Description>
                                                    <List.Description>{val.contact}</List.Description>
                                                </Responsive>
                                            </Grid.Column>
                                            <Responsive as={Grid.Column} minWidth={Responsive.onlyTablet.minWidth}>
                                                <List.Description>{val.email}</List.Description>
                                                <List.Description>{val.contact}</List.Description>
                                            </Responsive>
                                            <Responsive
                                                as={Grid.Column}
                                                textAlign='right'
                                                width={2}
                                                maxWidth={Responsive.onlyMobile.maxWidth}
                                                className='compact-element'>
                                                <ContactModal
                                                    type='edit'
                                                    objectIndex={index}
                                                    object={val}
                                                    formState={formState}
                                                    updateFormState={setFormState}
                                                    updateStateChanges={checkStateChange} />
                                            </Responsive>
                                            <Responsive
                                                as={Grid.Column}
                                                textAlign='right'
                                                width={1}
                                                minWidth={Responsive.onlyTablet.minWidth}
                                                className='compact-element'>
                                                <ContactModal
                                                    type='edit'
                                                    objectIndex={index}
                                                    object={val}
                                                    formState={formState}
                                                    updateFormState={setFormState}
                                                    updateStateChanges={checkStateChange} />
                                            </Responsive>
                                            <Responsive 
                                                as={Grid.Column}
                                                textAlign='right' 
                                                width={2} 
                                                maxWidth={Responsive.onlyMobile.maxWidth}
                                                className='compact-element'>
                                                <ContactModal
                                                    type='delete'
                                                    objectIndex={index}
                                                    object={val}
                                                    formState={formState}
                                                    updateFormState={setFormState}
                                                    updateStateChanges={checkStateChange} />
                                            </Responsive>
                                            <Responsive 
                                                as={Grid.Column}
                                                textAlign='right' 
                                                width={1} 
                                                minWidth={Responsive.onlyTablet.minWidth}
                                                className='compact-element'>
                                                <ContactModal
                                                    type='delete'
                                                    objectIndex={index}
                                                    object={val}
                                                    formState={formState}
                                                    updateFormState={setFormState}
                                                    updateStateChanges={checkStateChange} />
                                            </Responsive>
                                        </Grid.Row>
                                    </Grid>
                                </List.Item>
                            ))}
                        </List>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

StoreInformation.propTypes = {
    store: PropTypes.object,
    handleUpdate: PropTypes.func
}

export default StoreInformation;