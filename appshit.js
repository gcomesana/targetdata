


(function() {
	Ext.Loader.setConfig({
		enabled : true,
		disableCaching: false,
		paths	 : {
			"TD": 'app',
			"Ext.ux": "extjs4.0.2/ux"
		}
	});

//		Ext.require ("UF.view.UserFormPanel")
//		Ext.require(['*']);


	Ext.require("TD.view.panel.NorthPanel");
	Ext.require("TD.view.panel.AccordionPanel")
	Ext.require("TD.view.panel.TabWestPanel")
	Ext.require("TD.view.panel.StatusSouthPanel")
	Ext.require("TD.view.panel.NavAccordionPanel")


	Ext.require([
		'Ext.form.Panel',
		'Ext.ux.form.MultiSelect',
		'Ext.ux.form.ItemSelector',
		'TD.view.form.FormSearch',
		'TD.view.panel.tab.TargetFunctionPanel',
		'TD.view.panel.tab.TargetFamilyPanel',
		'TD.view.panel.tab.PathwaysPanel',
		'TD.view.panel.tab.InteractionsPanel',
		'TD.view.GridUsers'
	]);

	Ext.Ajax.disableCaching = false;

	Ext.application({
		name: "TD",
		appFolder: "app",

		controllers: [
			"ButtonsCtrl"
		],

		launch: function() {
//				var userWin = Ext.create('widget.editorwindow')
//				userWin.show();
			Ext.QuickTips.init();

			var viewport = Ext.create('Ext.container.Viewport', {
				id: 'border-example',
				layout: 'fit',

				items: [{
					xtype: "usersgrid"

//					title: 'FieldContainer Example',
//					width: 550,
//					bodyPadding: 10
/*
					items: [ {
						xtype: 'fieldcontainer',
						fieldLabel: 'Last Three Jobs',
						labelWidth: 100,

						// The body area will contain three text fields, arranged
						// horizontally, separated by draggable splitters.
						layout: 'hbox',
						items: [{
								xtype: 'textfield',
								flex: 1
						}, {
								xtype: 'splitter'
						}, {
								xtype: 'textfield',
								flex: 1
						}, {
								xtype: 'splitter'
						}, {
								xtype: 'textfield',
								flex: 1
						}]
					},* {
						xtype: "usersgrid"
					}]
*/
					 
				}] // EO items
			}) // EO create
		} // EO launch
	}) // EO application
//			renderTo: Ext.getBody()
})();