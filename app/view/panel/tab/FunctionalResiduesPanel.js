
var msg = '<div id="workinprogress-1" class="workinprogress-cls"> <h1>Work in progress!!</h1>'
msg +=	'<p class="workinprogress-txt">Based on FireDB</p></div>'

Ext.define ("TD.view.panel.tab.FunctionalResiduesPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.functionalresidues",

//	contentEl: 'workinprogress-3',
	html: msg,
	title: 'Functional residues',
//								closable: true,
	autoScroll: true,
	bodyPadding: 10,

	items: [],

	initComponent: function () {
		this.callParent(arguments)
	}

})