import { LightningElement, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/ContactController.getContacts';
import createContact from '@salesforce/apex/ContactController.createContact';
import updateContact from '@salesforce/apex/ContactController.updateContact';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';

export default class ContactManager extends LightningElement {
    @track contacts;
    @track contact = { FirstName: '', LastName: '', Email: '', Phone: '' };
    @track editMode = false;
    @track selectedContactId;

    get buttonLabel(){
        return this.editMode ? 'Save' : 'Add';
    }

    @wire(getContacts)
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleFirstNameChange(event) {
        this.contact.FirstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.contact.LastName = event.target.value;
    }

    handleEmailChange(event) {
        this.contact.Email = event.target.value;
    }

    handlePhoneChange(event) {
        this.contact.Phone = event.target.value;
    }

    handleEdit(event) {
        this.editMode = true;
        this.selectedContactId = event.target.value
        let selectedContact = this.contacts.find(contact => contact.Id === this.selectedContactId);
        this.contact = Object.assign({}, selectedContact);
    }

    handleCancel() {
        this.editMode = false;
        this.contact = { FirstName: '', LastName: '', Email: '', Phone: '' };
    }

    handleSave() {
        if (this.editMode) {
            updateContact({ contact: this.contact })
                .then(() => {
                    this.editMode = false;
                    this.contact = { FirstName: '', LastName: '', Email: '', Phone: '' };
                    return getContacts();
                })
                .then(result => {
                    this.contacts = result;
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            createContact({ contact: this.contact })
                .then(result => {
                    this.contact = { FirstName: '', LastName: '', Email: '', Phone: '' };
                    return getContacts();
                })
                .then(result => {
                    
                    this.contacts = result;
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }
    handleDelete(event) {
        let contactId = event.target.value;
        deleteContact({ contactId: contactId })
            .then(() => {
                return getContacts();
            })
            .then(result => {
                this.contacts = result;
            })
            .catch(error => {
                console.error(error);
            });
    }
}