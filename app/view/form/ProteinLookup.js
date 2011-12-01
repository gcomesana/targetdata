


var uniComboStore = Ext.create ("TD.store.ProteinLookup")


// Ext.create("Ext.form.field.ComboBox", {
Ext.define ("TD.view.form.ProteinLookup", {
	extend: "Ext.form.field.ComboBox",
	alias: "widget.combo-protein-lookup",

	queryMode: "remote",
	store: uniComboStore,
	displayField: "names",
	valueField: "entry", // like P92347
	typeAhead:true,
	minChars: 3,
	queryParam: "target_uuid",
	fieldLabel: "Term",
	triggerAction: "query",
	
	listConfig: {
		getInnerTpl: function() {
			return '<div data-qtip="genes: {genes}">{entry}<br>' +
				'<small><i><tpl for="names"><b>{.}</b><br/></tpl></i></small></div>';
		},
		emptyText: "Start typing..."
	}
})