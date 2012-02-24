

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
		'TD.util.CustomAjax',
		'TD.model.ProteinLookup',
		'TD.store.ProteinLookup',
		'TD.view.form.FormSearch',
		'TD.view.form.ProteinLookup',
		'TD.view.form.ExamplesCombo',
		'TD.view.panel.CenterTabs',
		'TD.view.tab.TargetGenericPanel',
		'TD.view.Viewport'
	]);
	Ext.Ajax.disableCaching = false;

	Ext.application({
		name: "TD",
		appFolder: "app",

		controllers: [
			"TargetInfo"
//			"CenterTabs"
		],

		autoCreateViewport: true,

		launch: function() {
console.info("launchinnggggggggggg")

			TD.util.CustomAjax.init({clearCache:true})
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