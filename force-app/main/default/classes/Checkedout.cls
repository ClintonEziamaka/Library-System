public with sharing class Checkedout {
    @AuraEnabled(cacheable=true)
// List of employees with checked out items.
  public static List<Employee__c> getCheckedOut() {

// Get all borrowed items. 
    List<Borrowed__c> ret = [SELECT Name,Item__c,Employee__r.Employee_Id__c,Return_Date__c FROM Borrowed__c];
    List<Employee__c> emp = new List<Employee__c>();

    for(Borrowed__c bor: ret){
// Get all employees information that have a borrow record. Match them by Id.
        Employee__c emp2 = [SELECT Employee_Id__c, Name, Email__c, Department__c, Phone_Number__c FROM Employee__c WHERE Employee_Id__c =: bor.Employee__r.Employee_Id__c];

        if(bor.Return_Date__c!=null && !emp.contains(emp2)) {
        
            emp.add(emp2);
        }
    }
   // return employee information
    return emp;

    }
}
