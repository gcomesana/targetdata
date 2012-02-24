


Ext.define ("TD.view.panel.tab.InteractionsPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.interactions",

//	contentEl: 'workinprogress-3',
	html: '<div id="workinprogress-1" class="workinprogress-cls"> <h1>Work in progress!!</h1></div>',
	title: 'Interactions',
//								closable: true,
	autoScroll: true,
	bodyPadding: 10,

	items: [],

	initComponent: function () {
		this.callParent(arguments)
	}
})