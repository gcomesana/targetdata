/**
 * Controls the tabs in order to show the proper content and load and render
 * the content in the case necessary
 */
Ext.define ("TD.controller.CenterTabs", {
	views: [
		"panel.CenterTabs",
		"tab.TargetGenericPanel"
	],

	models: ['User', 'CacheReqParam', 'CacheReq'],
	stores: ['Users', 'CacheReqs'],

	extend: "Ext.app.Controller",

	init: function () {
		this.control({
			'viewport center-tabs panel': {
//				activate: this.onPanelShow
			}
		})

	}

})