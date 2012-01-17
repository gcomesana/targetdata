

Ext.define ("TD.view.ListKeywords", {
	extend: "Ext.ux.form.MultiSelect",
	alias: "widget.listkeywords",

	msgTarget: 'side',
	fieldLabel: 'Multiselect',
	name: 'multiselect',
//	width: "300px",

	allowBlank: false,
	// minSelections: 2,
	maxSelections: 3,
	/*
	store: [[123,'One Hundred Twenty!!'],
					['1', 'One'], ['2', 'Two'], ['3', 'Three'], ['4', 'Four'], ['5', 'Five'],
					['6', 'Six'], ['7', 'Seven'], ['8', 'Eight'], ['9', 'Nine']],
//	value: ['3', '4', '6'],
	*/
	ddReorder: true,

	initComponent: function () {
console.log ("calling ListKeywords.initComponent")
		this.callParent()
	}

})