trigger insertBorrowing on Borrowed__c (before insert) {
            Controller t= new Controller();
            if(Trigger.isBefore){
                t.validateBorrowedDates(Trigger.new);
                t.checkItem(Trigger.new);
            }

}