/**
 * Controls the tabs in order to show the proper content and load and render
 * the content in the case necessary
 */
Ext.define ("TD.controller.CenterTabs", {
	views: [
		"panel.CenterTabs",
		"tab.TargetGenericPanel"
	],
	
	extend: "Ext.app.Controller",

	init: function () {
		this.control({
			'viewport center-tabs panel': {
				activate: this.onPanelShow
			}
		})

	},


	onPanelShow: function (aTab, opts) {
		var theId = aTab.getId()

		console.info ("controller.CenterTabs: activate '"+theId+"' tab")
	}
})