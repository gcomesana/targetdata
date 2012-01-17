
// West panel will be a tabpanel...
Ext.define ("TD.view.panel.TabWestPanel", {
	extend: "Ext.tab.Panel",
	alias: "widget.tab-west-panel",

	initComponent: function () {
		this.callParent()
	},

	title: 'Mission Control',
//	split: true, // not for here... depends on the desktop
	width: 200,
	minWidth: 175,
	maxWidth: 400,
	collapsible: true,
	animCollapse: true,
	margins: '0 0 0 5'
	



})