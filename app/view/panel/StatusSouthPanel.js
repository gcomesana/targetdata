

Ext.define("TD.view.panel.StatusSouthPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.statuspanel",

	height: 100,
	minHeight: 100,
	minSize: 100,
	maxSize: 200,
	collapsible: true,
	collapsed: true,
	title: 'Status Panel',
	margins: '0 0 0 0',
//	html: "<h2>This is phantastic</h2>",

	initComponent: function () {
		this.callParent()
	}

})