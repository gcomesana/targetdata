Ext.define('TD.view.UsersGrid', {
	extend	 : 'Ext.grid.Panel',
	alias		: 'widget.usersgrid',
	requires : ['TD.store.Users'],

	initComponent : function() {
		this.store = TD.store.Users;
		this.columns = this.buildColumns();
		this.callParent();
	},
	
	buildColumns : function() {
		return [
			{
				header		: 'theName',
				dataIndex : 'name',
				width		 : 70,
				flex: 1
			},
			{
				header		: 'theEmail',
				dataIndex : 'email',
				width		 : 70
			}
		];
	}
});
