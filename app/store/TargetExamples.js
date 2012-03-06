/**
 * The store where get out the examples
 */
// Ext.require (['TD.model.TargetExample'])
Ext.define ("TD.store.TargetExamples", {
	extend: "Ext.data.Store",
	requires: 'TD.model.TargetExample',

	model		 : 'TD.model.TargetExample',
	proxy: {
//		url: "resources/data/test-uniprot.json",
		type: "ajax",
		url: "resources/data/examples.json",
		reader: {
			type: 'json'
		}
	},
	
	autoLoad: true,
	storeId: "examplesStore",

	constructor : function() {
		this.callParent(arguments);
	}
})