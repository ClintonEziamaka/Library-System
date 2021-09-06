// Import library and schema paths
import { LightningElement } from 'lwc';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import BORROWED_OBJECT from '@salesforce/schema/Borrowed__c';
import EMPLOYEE_FIELD from '@salesforce/schema/Borrowed__c.Employee__c';
import ITEM_FIELD from '@salesforce/schema/Borrowed__c.Item__c';
import ISSDATE_FIELD from '@salesforce/schema/Borrowed__c.Issued_Date__c';
import RETURNDATE_FIELD from '@salesforce/schema/Borrowed__c.Return_Date__c';
import EMAIL_FIELD from '@salesforce/schema/Borrowed__c.Email__c';

export default class BarcodeScanner extends LightningElement {
// Declarations
    sessionScanner;
    scannedBarcodes = '';
    BorrowedId;
    BorrowedObject = BORROWED_OBJECT;
    employeeField = EMPLOYEE_FIELD;
    itemsField = ITEM_FIELD;
    IssDateField = ISSDATE_FIELD;
    returnDateField = RETURNDATE_FIELD;
    emailField =  EMAIL_FIELD;

// Connect scanner
    connectedCallback() {
        this.sessionScanner = getBarcodeScanner();
    }

    beginScanning() {
// Reset scannedBarcode to empty string before starting new scanning session
        this.scannedBarcodes = '';

// Make sure BarcodeScanner is available before trying to use it
        if (this.sessionScanner != null && this.sessionScanner.isAvailable()) {
            const scanningOptions = {
                barcodeTypes: [this.sessionScanner.barcodeTypes.QR]
            };
// Begin capture scans the Scanning Option then returns the scannedbarcode string as a promise.
            this.sessionScanner
                .beginCapture(scanningOptions)
                .then((scannedBarcode) => {
                    this.processScannedBarcode(scannedBarcode);
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Successful Scan',
                            message: 'Barcode scanned successfully.',
                            variant: 'success'
                        })
                    );
                }
                    
                )
//  Ends capture if the user clicks cancel
                .catch((error) => {
                    console.error(error);
                    this.sessionScanner.endCapture();
                })
// Else continue scanning
                .finally(() => this.continueScanning());
        }
// Display error message if scanner is disconnected. 
        else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Barcode Scanner Is Not Available',
                    message:
                        'No Barcode scanner is currently available.',
                    variant: 'error'
                })
            );
        }
    }

    continueScanning() {
// Checks if barcodeScanner is still available
        if (this.sessionScanner.isAvailable()) {
            this.sessionScanner
                .resumeCapture()
                .then((scannedBarcode) =>
                    this.processScannedBarcode(scannedBarcode)
                )
// BarcodeScanner.isAvailable() returns false after endCapture() is called on it
                .catch((error) => {
                    console.error(error);
                    this.sessionScanner.endCapture();
                })
                .finally(() => this.continueScanning());
        }

// If the scanner gets disabled in between sessions, display error message.
        else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Barcode Scanner Is Not Available',
                    message:
                        'No Barcode scanner is currently available. It might have been disconnected.',
                    variant: 'error'
                })
            );
        }
    }

//  Creates a borrowed record.
    processScannedBarcode(barcode) { 
// Probably dehash the barcode with .substring() and declare them to thier respective fields.
        const fields = {};
        fields[EMPLOYEE_FIELD] = this.employeeField;
        fields[ITEM_FIELD] = barcode;
        fields[ISSDATE_FIELD] = this.IssDateField;
        fields[RETURNDATE_FIELD] = this.returnDateField;
        fields[EMAIL_FIELD] = this.emailField;
        const recordInput = {BorrowedObject, fields};
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
}