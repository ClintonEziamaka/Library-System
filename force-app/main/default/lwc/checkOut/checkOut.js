// Import library and schema paths
import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BORROWED_OBJECT from '@salesforce/schema/Borrowed__c';
import EMPLOYEE_FIELD from '@salesforce/schema/Borrowed__c.Employee__c';
import ITEM_FIELD from '@salesforce/schema/Borrowed__c.Item__c';
import ISSDATE_FIELD from '@salesforce/schema/Borrowed__c.Issued_Date__c';
import RETURNDATE_FIELD from '@salesforce/schema/Borrowed__c.Return_Date__c';
import EMAIL_FIELD from '@salesforce/schema/Borrowed__c.Email__c';


export default class CheckOut extends LightningElement {
    // Declare our fields
    BorrowedId;
    BorrowedObject = BORROWED_OBJECT;
    employeeField = EMPLOYEE_FIELD;
    itemsField = ITEM_FIELD;
    IssDateField = ISSDATE_FIELD;
    returnDateField = RETURNDATE_FIELD;
    emailField =  EMAIL_FIELD;

    // On success of the form submition
    handleBorrowedCreated() {
        // Assign fields
        const fields = {};
        fields[EMPLOYEE_FIELD] = this.employeeField;
        fields[ITEM_FIELD] = this.itemsField;
        fields[ISSDATE_FIELD] = this.IssDateField;
        fields[RETURNDATE_FIELD] = this.returnDateField;
        fields[EMAIL_FIELD] = this.emailField;
        // Set our record input
        const recordInput = {BorrowedObject, fields};
        // Create a new record
        createRecord(recordInput)
            .then(account => {
                this.BorrowedId = account.Name;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Check Out Complete',
                        variant: 'success',
                    }),
                );
            })
         // Catch and display error message
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            })



    }

    // To handle fields reset
    handleReset(event){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if(inputFields)
        inputFields.forEach(element => {
            element.reset();
        });
    }


}

