public with sharing class Controller {

    //Validate employee id size
    public void employeeValidation(List<Employee__c> emp) {
        for (Employee__c e: emp){
            if(e.Employee_id__c > 999 || e.Employee_id__c < 100){
                e.Employee_id__c.addError('Employee Id should be 3 digits');
            }
        }
    }

     //Validate Issue date and Return date before Borrowing insertion
    public void validateBorrowedDates(List<Borrowed__c> bor){
        for(Borrowed__c b:bor){
            if(b.Issued_Date__c==null){
            b.Issued_Date__c.addError('Issued date cannot be empty');
        }
        else if(b.Issued_Date__c!=date.today()){
            b.Issued_Date__c.addError('Issued date must be todays date');
        }
        if(b.Return_Date__c>b.Due_Date__c){
            b.Return_Date__c.addError('Return date is past the Due date');
        }
        else if(b.Return_Date__c<b.Issued_Date__c || b.Return_Date__c<date.today()){
            b.Return_Date__c.addError('Return date cannot be before todays date'); 
        }
    }
}
    //Items that have been checked out cannot be borrowed
    public void checkItem(List<Borrowed__c> bor){
        for(Borrowed__c b:bor){
            List<Item__c> ite = [SELECT Name  FROM Item__c WHERE Name like:b.Item__r.Name];
            for(Item__c i:ite)
            if(i.Name==b.Item__r.Name){
                b.Item__c.addError('You cannot check out a borrowed Item');
            }
        }
    }

    







}
