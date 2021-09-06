public with sharing class searchbar {
    @AuraEnabled(cacheable=true)

    // Returns a single item when keyWord matches itemName
    public static List<Item__c> getItems(String key){
            String keyString = '%' + key + '%';
            return [select Item_Id__c, Name, Type__c, Status__c from Item__c where Name like:keyString];
    
    }
}


