Ext.define('TD.view.KeywordsGridPanel', {
	extend	 : 'Ext.grid.Panel',
	alias		: 'widget.keywordsgrid',
	requires : ['TD.store.UserStore'],

	initComponent : function() {
//		this.store = UF.store.UserStore;
		this.store = TD.store.Keywords
		this.columns = this.buildColumns();
		this.callParent();
	},
	buildColumns : function() {
		return [
			{
				header		: 'First Name',
				dataIndex : 'firstName',
				width		 : 70
			},
			{
				header		: 'Last Name',
				dataIndex : 'lastName',
				width		 : 70
			},
			{
				header		: 'DOB',
				dataIndex : 'dob',
				width		 : 70
			},
			{
				header		: 'Login',
				dataIndex : 'userName',
				width		 : 70
			}
		];
	}
});
