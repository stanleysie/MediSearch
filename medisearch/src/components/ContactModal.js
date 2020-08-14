/* REACT AND CSS */
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Icon, Input, Modal } from 'semantic-ui-react'

/**
 * <ContactModal    type
 *                  objectIndex
 *                  object
 *                  fromState
 *                  updateFormState
 *                  updateStateChanges />
 * 
 * @prop { string } type - action type
 * @prop { integer } objectIndex - object index
 * @prop { object } object - contact object
 * @prop { object } formState - object key
 * @prop { function } updateFormState - function to manipulate form state
 * @prop { function } updateStateChanges - function to update state change
 */
function ContactModal(props) {
    const { type, objectIndex, object, formState } = props;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [modal, setModal] = useState({ edit: false, delete: false });

    /**
     * Initialize data upon editing data.
     */
    const setData = () => {
        if(modal.edit || modal.delete) {
            if(type === 'edit') {
                setName(object.name);
                setEmail(object.email);
                setContact(object.contact);
            } else {
                setName('');
                setEmail('');
                setContact('');
            }
        }
    }

    useEffect(setData, [object, type, modal]);

    /**
     * This function handles creating contact.
     */
    const handleCreate = () => {
        let formStateClone = {...formState};
        formStateClone.contact.push({ name, email, contact });
        props.updateFormState(formStateClone);
        props.updateStateChanges(formStateClone);
        resetModal();
    }

    /**
     * This function handles editing contact.
     */
    const handleEdit = () => {
        let formStateClone = {...formState};
        formStateClone.contact.splice(objectIndex, 1, { name, email, contact });
        props.updateFormState(formStateClone);
        props.updateStateChanges(formStateClone);
        resetModal();
    }

    /**
     * This function handles deleting contact.
     */
    const handleDelete = () => {
        let formStateClone = {...formState};
        formStateClone.contact.splice(objectIndex, 1);
        props.updateFormState(formStateClone);
        props.updateStateChanges(formStateClone);
        resetModal();
    }

    /**
     * This function closes all the modals.
     */
    const resetModal = () => {
        setModal({ edit: false, delete: false });
    }

    return (
        type === 'create' || type === 'edit' ? 
            <Modal
                open={modal.edit}
                onClose={resetModal}
                closeOnDimmerClick={false}
                closeOnEscape={false}
                centered
                size='tiny'
                className='web-modal'
                trigger={
                    type === 'create' ?
                        <Button
                            type='button'
                            className='page-buttons'
                            content='Add'
                            onClick={() => setModal({...modal, edit: true })} />
                    :
                        <Icon
                            link
                            name='pencil'
                            onClick={() => setModal({...modal, edit: true })} />
                }>
                <Modal.Header className='modal-headers'>{type === 'create' ? 'Add Contact' : 'Edit Contact'}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field 
                            required
                            control={Input}
                            type='text'
                            label='Name'
                            placeholder='Name'
                            value={name}
                            onChange={(event, { value }) => setName(value)} />
                        <Form.Field 
                            control={Input}
                            type='email'
                            label='Email Address'
                            placeholder='Email Address'
                            value={email}
                            onChange={(event, { value }) => setEmail(value)} />
                        <Form.Field 
                            control={Input}
                            type='text'
                            label='Contact Number'
                            placeholder='Contact Number'
                            value={contact}
                            onChange={(event, { value }) => setContact(value)} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        type='button'
                        className='modal-buttons'
                        floated='right'
                        content={type === 'create' ? 'Add' : 'Update'}
                        disabled={name === ''}
                        onClick={type === 'create' ? handleCreate : handleEdit} />
                    <Button 
                        type='button'
                        floated='right'
                        content='Cancel'
                        onClick={resetModal} />                    
                </Modal.Actions>
            </Modal>
        :
            <Modal
                open={modal.delete}
                onClose={resetModal}
                closeOnDimmerClick={false}
                closeOnEscape={false}
                centered
                className='web-modal'
                size='mini'
                trigger={
                    <Icon
                        link
                        name='trash'
                        onClick={() => setModal({...modal, delete: true})} />
                }>
                <Modal.Header className='modal-headers'>Delete Contact</Modal.Header>
                <Modal.Content>
                    Are you sure you want to delete <strong>{object.name}</strong>?
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        type='button'
                        className='modal-buttons'
                        floated='right'
                        content='Delete'
                        onClick={handleDelete} />
                    <Button 
                        type='button'
                        floated='right'
                        content='Cancel'
                        onClick={resetModal} />
                </Modal.Actions>
            </Modal>
    )
}

ContactModal.propTypes = {
    type: PropTypes.string,
    objectIndex: PropTypes.number,
    object: PropTypes.object,
    formState: PropTypes.object,
    updateFormState: PropTypes.func,
    updateStateChanges: PropTypes.func
}

export default ContactModal;