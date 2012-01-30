/**
 * Created by JetBrains WebStorm.
 * User: bioinfo
 * Date: 16/11/11
 * Time: 18:46
 * To change this template use File | Settings | File Templates.
 */

var comboStore = Ext.create ("TD.store.Users")
var uniComboStore = Ext.create ("TD.store.ProteinLookup")

Ext.define("TD.view.Viewport", {
	extend: "Ext.container.Viewport",
	alias: "widget.tdviewport",

	layout: "border",

	initComponent: function () {
		this.items = [
			{
				xtype:"northpanel",
				region: "north"
//				margin: "5, 0, 0, 10"
//				border: 0
			},/*
			{
				// lazily created panel (xtype:'panel' is default)
				region: 'south',
				contentEl: 'south',
				split: true,
				xtype: "panel",
				height: 100,
				minHeight: 100,
				minSize: 100,
				maxSize: 200,
				collapsible: true,
				collapsed: true,
				title: 'Status',
				margins: '0 0 0 0',
				html: "<h2>Message area (in progress)</h2>"

			}, */
			{
				xtype: "tab-west-panel",
				region: 'west',
				stateId: 'navigation-panel',
				id: 'west-panel', // see Ext.getCmp() below
				split: true,
				width: 300,
				// define the tabs as items
				items: [
					{
						autoScroll: true,
//								html: "<h1>HTML in h1</h1>",
						title: 'Search',
//									iconCls: 'nav' // see the HEAD section for style used
						items: [{
								xtype: "formsearch"
							}
						]
					}
				]
			},
			// in this instance the TabPanel is not wrapped by another panel
			// since no title is needed, this Panel is added directly
			// as a Container
			{
				xtype: "center-tabs",
				region: "center"
			}
		] // viewport

// if not included, the component is not initialized and then the page is blank!!
		this.callParent(arguments)
	}
})