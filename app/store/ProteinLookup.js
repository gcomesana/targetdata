

Ext.define('TD.store.ProteinLookup', {
	extend		: 'Ext.data.Store',
	requires	: ['TD.model.ProteinLookup'],
//	singleton: true,

	model		 : 'TD.model.ProteinLookup',
	proxy: {
		type: "ajax",
//		url: "resources/data/test-uniprot.json",
		url: "/cgi-bin/uniprot-entries.rb",
		reader: {
			type: "json",
			root: "items"
		}
	},
	autoLoad: true,
	storeId: "userstore",
//    storeId   : 'MyApp.store.UserStore',


	constructor : function() {
		this.callParent(arguments);
	/*
		this.loadData([
			{
				firstName : 'Louis',
				lastName	: 'Dobbs',
				dob			 : '12/21/34',
				userName	: 'ldobbs'
			},
			{
				firstName : 'Sam',
				lastName	: 'Hart',
				dob			 : '03/23/54',
				userName	: 'shart'
			},
			{
				firstName : 'Nancy',
				lastName	: 'Garcia',
				dob			 : '01/18/24',
				userName	: 'ngarcia'
			}
		]);*/
	}

});