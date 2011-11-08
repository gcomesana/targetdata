
var uniprotTest = /^[A-Z]\d{5}$/;
Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    uniprot: function(val, field) {
        return uniprotTest.test(val);
    },
    // vtype Text property: The error text to display when the validation function returns false
    uniprotText: "Not a valid Uniprot id. It has to be 'Pddddd', d is a digit",
    // vtype Mask property: The keystroke filter mask
    uniprotMask:  /[A-Z]|\d/
});