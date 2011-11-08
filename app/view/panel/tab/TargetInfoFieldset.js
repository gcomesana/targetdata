/**
 * This is a field set to group all information about a target.
 * This component is necessary as it can be several entries in an uniprot file and
 * displaying all entire info at the same time can be overwhelming.
 * So, for each entry (accesion) in the file, a new fieldset will be rendered,
 * all of them collapsed except the first one.
 * Inside them, collapsible panels display information as well
 */

Ext.define ("TD.view.panel.tab.TargetInfoFieldset", {
	extend: "Ext.form.FieldSet",
	alias: "widget.targetinfo-fs",

//								closable: true,
	collapsible: true,
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