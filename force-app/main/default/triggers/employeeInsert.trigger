trigger employeeInsert on Employee__c (before insert) {
    Controller e = new Controller();
    if (Trigger.isBefore){
        e.employeeValidation(Trigger.new);
    }

    
}