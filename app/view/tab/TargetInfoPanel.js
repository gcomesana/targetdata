/**
 * This is the panel which is embedded in the first tab of the content tab panel
 * This is what have to be embedded in the fieldset
 */
Ext.define ("TD.view.tab.TargetInfoPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.targetinfo",

	title: 'Target information',
//								closable: true,
	autoScroll: true,
	collapsible: true,
	bodyPadding: 10,
	layout: {
		type: "hbox"
	},

	defaults: {margins: '0 0 10 0'},

// may have to put it in a config object...
	tpl: {}, // template to render the content into the panel
	tplObj: {},

	listeners: {
		render: function (comp, opts) {
//			tpl = self.createInfoXTpl ()
			this.tpl.overwrite(comp.body, this.tplObj)
		}
	}


/*
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
*/
})