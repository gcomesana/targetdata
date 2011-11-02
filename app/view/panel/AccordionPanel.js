

Ext.define ("TD.view.panel.AccordionPanel", {

	extend: "Ext.panel.Panel",
	alias: "widget.accordion-panel",

	minWidth: 175,
	maxWidth: 400,
	collapsible: true,
	animCollapse: true,
	margins: '0 0 0 5',
	layout: 'accordion',

// this one can NOT be passes as a config parameter, here is cause handy purposes
	items: [{
			/*
			 contentEl: 'west',
			 title: 'Navigation',
			 iconCls: 'nav' // see the HEAD section for style used
			 */
			xtype: "navpanel",
			// html: "<div style=\"color:red\">Navigation</div>",
			title: "Navigation",
			items: [{
					xtype: "button",
					itemId: "btnNewTab",
					text: "New Tab",
					style: {
						backgroundColor: "white"
					}
				}
			] // EO items
		},
		{
			title: 'Settings',
			html: '<div style=\"color:#3399bb\">Settings.</div>',
//											iconCls: 'settings'
			xtype: "navpanel"
		},
		{
			title: 'Information',
			html: '<div style=\"color:#7fff00\">Some info in here.</div>'
//											iconCls: 'info'
		}
	],

	initComponent: function () {
		this.callParent()
	}
})