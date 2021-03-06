
Ext.define('TD.store.Users', {
	extend		: 'Ext.data.Store',
	requires	: ['TD.model.User'],
//	singleton: true,

	model		 : 'TD.model.User',
	proxy: {
		type: "ajax",
		url: "resources/data/miniuser.json",
		reader: {
			type: "json",
			root: "users"
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