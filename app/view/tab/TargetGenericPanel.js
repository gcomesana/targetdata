/**
 * This is the component which compose each of the panel tabs.
 * Each of this is intended to support any kind of information.
 * For the first tab, i.e., it will be a set of fieldsets for each uniprot entry;
 * for the rest of then, the content can be anything
 */
Ext.define ("TD.view.tab.TargetGenericPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.target-generic-panel",

	title: 'Target information',
//								closable: true,
	autoScroll: true,
//	bodyPadding: 10,
	layout: {
		type: "vbox"
	},

	defaults: {margins: '0 0 10 0'},

	alreadyLoaded: false

	//
	/* may have to put it in a config object...
	tpl: {}, // template to render the content into the panel
	tplObj: {},

	listeners: {
		render: function (comp, opts) {
//			tpl = self.createInfoXTpl ()
			this.tpl.overwrite(comp.body, this.tplObj)
		}
	}
	*/
})