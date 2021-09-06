import { LightningElement, track, wire } from 'lwc';
import getItems from '@salesforce/apex/searchbar.getItems';
const DELAY = 300;

export default class Search extends LightningElement { 
    searchWord='';
 @track items = [];
 @track error;
 @wire(getItems, {key:'$searchWord'})
 
        retrieveItems({error, data}){
            if(data){
                this.items = data
            }
            else if(error){

            }
        }
        
        handleChange(event) {
            const keyName = event.target.value;
            console.log(keyName);
            window.clearTimeout(this.delayTimeout);
            
            this.delayTimeout = setTimeout(() => {
              this.searchWord = keyName;
              getItems({key: this.searchWord}).then(pro => {
                    this.items = pro;
                    this.error = undefined;
                }).catch(error => {
                    this.error = error;
                    this.items = undefined;
                });
            },DELAY);
        }

}