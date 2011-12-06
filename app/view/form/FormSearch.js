
Ext.require (["TD.view.form.ProteinLookup"])
Ext.define ("TD.view.form.FormSearch", {
	extend: "Ext.form.Panel",
	alias: "widget.formsearch",

	bodyPadding: "20 5 5 5",
//	layout: "anchor",
	layout: "anchor",

	border: 0,
	id: 'formSearch',
	currentUniprotId: '',

	items: [{
		xtype: "combo-protein-lookup"

		/*
		fieldLabel: "Keyword search",
		name: "frmKey",
		iconCls: "icon-grid",
		fieldCls: "x-form-field",
		itemId: "txtIdSearch",
		id: "txtIdSearch",
		vtype: "uniprot",
		emptyText: "Uniprot id (i.e. 'P47928')"
		*/
	}, {
		xtype     : 'textarea',
		grow      : false,
		name      : 'frmSeq',
		fieldLabel: 'Sequence search',
		itemId: 'txtSeqSearch',
		disabled: true
	}],

/*
	items:[{
			xtype: 'compositefield',
			fieldLabel: 'Composite',
			items: [{
					xtype: 'textfield',
					id: 'labInternal',
					width: 140,
					height: 40,
					isFormField: true
				}, {
					xtype: 'button',
					id: 'labExternal',
					text: 'GoSearch',
					isFormField: true
				}
			]
		},
		{
			xtype		 : 'textarea',
			grow			: false,
			name			: 'frmSeq',
			fieldLabel: 'Sequence search'
		}
	],
*/
	buttons:[ {
		xtype: "button",
		itemId: "btnSearch",
		text: "Search",
		name: "btnSearch",
		id: "btnSearch"
		/*
		handler: function () {
			console.info ("btnSearch handler")
		}
		*/
	}],

	initComponent: function () {
		this.callParent()
	}
})