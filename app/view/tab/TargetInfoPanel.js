/**
 * This is the panel which is embedded in the first tab of the content tab panel
 * This is what have to be embedded in the fieldset.
 * Features embedded templates and json object: the goal is to display the
 * info contained in the json object by using the templates, one of the only
 * intended to display a 0 result message.
 * The emptyObjThreshold is intended to be used as a threshold to take a decision
 * about whether or not rendering the empty template or the normal template
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
	emptyTpl: {}, // template to display in the case the resultset is empty
	tplObj: {},
	emptyObjThreshold: 0,
	numItems: 0,

	listeners: {
		render: function (comp, opts) {
//			tpl = self.createInfoXTpl ()
			if (this.numItems >= this.emptyObjThreshold)
				this.tpl.overwrite(comp.body, this.tplObj)
			else
				this.emptyTpl.overwrite(comp.body, this.tplObj)
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