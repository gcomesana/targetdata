/**
 * This is the panel which is embedded in the first tab of the content tab panel
 * This is what have to be embedded in the fieldset
 */
Ext.define ("TD.view.panel.tab.TargetInfoPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.targetinfo",

	title: 'Target information',
//								closable: true,
	autoScroll: true,
	bodyPadding: 10,
	layout: {
		type: "vbox"
	},

	defaults: {margins: '0 0 10 0'},
	items: [{
		xtype: "panel",
		width: 500,
		bodyPadding: 5,
		collapsible: true,
		hidden: true,
		title: "Uniprot Info",
		itemId: "uniprotInfo",
		id: "uniprotInfo",
		header: false
	},{
		xtype: "panel",
		width: 500,
		bodyPadding: 5,
		collapsible: true,
		collapsed: true,
		hidden: true,
		title: "Citations",
		itemId: "citationInfo",
		id: "citationInfo"
	},{
		xtype: "panel",
		width: 500,
		bodyPadding: 5,
		collapsible: true,
		collapsed: true,
		hidden: true,
		title: "Other references",
		itemId: "dbRefInfo",
		id: "dbRefInfo"
	}]

})