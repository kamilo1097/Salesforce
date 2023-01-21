public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts() {
        return [SELECT FirstName, LastName, Email, Phone FROM Contact];
    }
    @AuraEnabled
    public static Contact createContact(Contact contact) {
        insert contact;
        return contact;
    }
    @AuraEnabled
    public static void updateContact(Contact contact) {
        update contact;
    }
    @AuraEnabled
    public static void deleteContact(Id contactId) {
        delete new Contact(Id = contactId);
    }
}