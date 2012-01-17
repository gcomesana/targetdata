/**
 * This is a field set to group all information about a target.
 * This component is necessary as it can be several entries in an uniprot file and
 * displaying all entire info at the same time can be overwhelming.
 * So, for each entry (accesion) in the file, a new fieldset will be rendered,
 * all of them collapsed except the first one.
 * Inside them, collapsible panels display information as well
 */

Ext.define ("TD.view.tab.InfoFieldset", {
	extend: "Ext.form.FieldSet",
	alias: "widget.targetinfo-fs",

//								closable: true,
	collapsible: true,
	autoScroll: true,
	bodyPadding: 10,
	collapsed: false,
	width: 500,
	
	layout: {
		type: "anchor"
	},

	defaults: {margins: '0 0 10 0'},

	items: [/*
		{
			xtype: "panel",
			bodyPadding: 5,
			collapsible: true,
			collapsed: false,
//			hidden: true,
			title: "Uniprot Target Info",
			itemId: "uniprotInfo",
			id: "uniprotInfo"
		},{
			xtype: "panel",
			bodyPadding: 5,
			collapsible: true,
			collapsed: true,
//			hidden: true,
			title: "Citations",
			itemId: "citationInfo",
			id: "citationInfo"
		},{
			xtype: "panel",
			bodyPadding: 5,
			collapsible: true,
			collapsed: true,
//			hidden: true,
			title: "Other references",
			itemId: "dbRefInfo",
			id: "dbRefInfo"
	}*/],


	initComponent: function () {

	  this.callParent(arguments)
	}


})