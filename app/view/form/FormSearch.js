
Ext.require (["TD.view.form.ProteinLookup", 'TD.view.form.ExamplesCombo'])
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
		xtype: "combo-protein-lookup",
		width: 275,
		listeners: {
			'afterrender': function (comp, opts) {
				Ext.tip.QuickTipManager.register({
					target: comp.getEl(),
					text: 'Start typing free text or a gene name, i.e., BRCA1'
				});
			} // EO listeners
		}

	}, {
		xtype     : 'textarea',
		grow      : false,
		name      : 'frmSeq',
		fieldLabel: 'Sequence search',
		itemId: 'txtSeqSearch',
		disabled: true,
		width: 275
	}, {
		xtype: 'examples-combo',
		fieldLabel: 'Examples',
//		margin: '50 0 0 105',
		margin: '50 0 0 0',
		width: 275
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