/**
 * This component encapsultes the five main tabs which are going to compose
 * the main content area.
 * Each panel is a target-generic-panel customized with a different id
 */

Ext.define ("TD.view.panel.CenterTabs", {
	extend: "Ext.tab.Panel",
	alias: "widget.center-tabs",

	deferredRender: false,
	activeTab: 0,		 // first tab initially active
	itemId: "centerTabs",
	id: "centerTabs",

	items: [{
			xtype: "target-generic-panel",
//			xtype: "panel",
			id: "infoPanel",
			title: "Target information"
/*
			items: [{
				xtype: "textfield",
				fieldLabel: "merdiña"
			},
			Ext.create ("Ext.form.field.ComboBox", {
				queryMode: "remote",
				store: Ext.create ("TD.store.UserStore"),
				displayField: "name",
				valueField: "id"
			})]
*/
		}, /* {
//								xtype: "targetfamily"
			xtype: "target-generic-panel",
			id: "targetFamily",
			html: '<div id="workinprogress-1" class="workinprogress-cls"> <h1>ContentTabPanel: Work in progress!!</h1></div>',
			title: 'Target family'
		},  {
			xtype: "target-generic-panel",
			html: '<div id="workinprogress-1" class="workinprogress-cls"><h1>Work in progress!!</h1></div>',
			title: 'Functional residues',
			id: "targetresidues"
		},*/{
			xtype: "target-generic-panel",
			title: 'Citations',
			id: "targetcitations",
			disabled: true
		}, {
			xtype: "target-generic-panel",
//			html: '<div id="workinprogress-1" class="workinprogress-cls"> <h1>ContentTabPanel: Work in progress!!</h1></div>',
			title: 'Pathways',
			id: "targetpathways",
			layout: "fit",
			disabled: true
		}, {
			xtype: "target-generic-panel",
//			html: '<div id="workinprogress-1" class="workinprogress-cls"> <h1>Work in progress!!</h1></div>',
			title: 'Interactions',
			id: "targetInteractions",
			disabled: true
		}
	],


	listeners: {
		activate: function (theTab, opts) {
//			alert ("activate theTab "+theTab.getId())
			console.info ("activate '"+theTab.getId()+"' tab")
		}
	}

})