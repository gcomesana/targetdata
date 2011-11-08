(function() {
	Ext.Loader.setConfig({
		enabled : true,
		disableCaching: false,
		paths	 : {
			"TD": 'app',
			"Ext.ux": "extjs4.0.2/ux"
		}
	});

//		Ext.require(['*']);

	Ext.require("TD.view.panel.NorthPanel");
	Ext.require("TD.view.panel.AccordionPanel")
	Ext.require("TD.view.panel.TabWestPanel")
	Ext.require("TD.view.panel.StatusSouthPanel")
	Ext.require("TD.view.panel.NavAccordionPanel")


	Ext.require([
		'Ext.form.Panel',
		'Ext.tip.*',
		'Ext.ux.form.MultiSelect',
		'Ext.ux.form.ItemSelector',
		'TD.view.form.FormSearch',
		'TD.view.panel.tab.TargetInfoPanel',
		'TD.view.panel.tab.TargetFamilyPanel',
		'TD.view.panel.tab.PathwaysPanel',
		'TD.view.panel.tab.InteractionsPanel',
		'TD.view.panel.tab.FunctionalResiduesPanel'
	]);
	Ext.Ajax.disableCaching = false;



	Ext.application({
		name: "TD",
		appFolder: "app",

		controllers: [
			"TargetInfoCtrl"
		],

		launch: function() {
//			console.info("launchinnggggggggggg")
//				var userWin = Ext.create('widget.editorwindow')
//				userWin.show();

			var viewport = Ext.create('Ext.Viewport', {
				id: 'border-example',
				layout: 'border',
				items: [{
						xtype:"northpanel",
						region: "north",
						margin: "5, 0, 0, 10",
						border: 2,
						style: {
//							backgroundColor: "white"
						}
//						height: 240
					},
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
						title: 'South',
						margins: '0 0 0 0',
						html: "<h2>Message area (in progress)</h2>"

					},
					{
						xtype: "tab-west-panel",
						region: 'west',
						stateId: 'navigation-panel',
						id: 'west-panel', // see Ext.getCmp() below
						split: true,
						width: 300,
						// define the tabs as items
						items: [{
								autoScroll: true,
//								html: "<h1>HTML in h1</h1>",
								title: 'Search',
//									iconCls: 'nav' // see the HEAD section for style used
								items: [{
									xtype: "formsearch"
								}]
							}/*,
							{
								title: 'Tab 2',
								xtype: "accordion-panel"
							}*/
						]
					},
					// in this instance the TabPanel is not wrapped by another panel
					// since no title is needed, this Panel is added directly
					// as a Container
					Ext.create('Ext.tab.Panel', {
						region: 'center', // a center region is ALWAYS required for border layout
						deferredRender: false,
						activeTab: 0,		 // first tab initially active
						itemId: "contentTabPanel",
						items: [{
								xtype: "targetinfo",
//								id: "functionPanel"
								id: "infoPanel"
							}, {
								xtype: "targetfamily"
							}, {
								xtype: "functionalresidues"
							}, {
								xtype: "pathwayspanel"
							}, {
								xtype: "interactions"
							}
						]
					})
				]
			}); // EO Viewport

			Ext.create ("Ext.tip.ToolTip", {
				html: "<b>UniProt</b> id like '<i>P12345</i>'",
				target: "txtIdSearch"
//				width: 200
			})

			Ext.QuickTips.init();

			// get a reference to the HTML element with id "hideit" and add a click listener to it
			Ext.get("hideit").on('click', function() {
				// get a reference to the Panel that was created with id = 'west-panel'
				var w = Ext.getCmp('west-panel');
				// expand or collapse that Panel based on its collapsed property state
				w.collapsed ? w.expand() : w.collapse();
			});
		} // EO launch!!
	}) // EO Ext.application
/*
	var panelBody = Ext.ComponentQuery.query ("viewport > panel")
	console.info ("panel.body: "+panelBody.body)
*/
})();