

Ext.define ("TD.controller.NorthPanel", {
	extend: "Ext.app.Controller",

	views: ['panel.NorthPanel'],

	targetInfoCtrl: null,

	init: function () {
		targetInfoCtrl = this.getController('TD.controller.TargetInfo')
	},

	onLaunch: function() {
		console.log ("NorthPanel controller onLaunch...")
		this.checkCoreAPI();
	},

	
	checkCoreAPI: function() {
		var me = this
		Ext.Ajax.request({
//			url: '/cgi-bin/check-api.rb',
//			url: '/cgi-bin/gateway/bin/cgigateway.rb',
			url: '/cgi-bin/cgiruby.rb',
			params: {
				what: targetInfoCtrl.CHECK_ENDPOINT
			},

			success: function(response) {
				var status_field = Ext.ComponentQuery.query('displayfield[id="ops_api_staus_id"]')[0];
				var statusFieldEl = status_field.bodyEl
				var jsonResp = response.responseText
				var jsonObj = Ext.JSON.decode (jsonResp)
				var statusMsg = '<span style="color: blue;font-weight: bolder;">'

				if (jsonObj.response_code < 0)
					statusMsg += 'Using local API</span>'

				else {// supposedly, a good endpoint was found
					statusMsg += 'Endpoint '
					statusMsg += '<span style="color: black">'+jsonObj.endpoint+'</span> will be used</span>'
				}
				status_field.setValue(statusMsg);
				setTimeout(function () {
					statusFieldEl.fadeOut({
						opacity: 0, //can be any value between 0 and 1 (e.g. .5)
						easing: 'easeOut',
						duration: 2000,
						remove: false,
						useDisplay: false
					})
				}, 4000)

				var targetInfoCtrl = me.getController('TD.controller.TargetInfo')
				targetInfoCtrl.setEndpoint(jsonObj.endpoint)
//				me.initComponents ()
			},

			failure: function(response) {
				var status_field = Ext.ComponentQuery.query('displayfield[id="ops_api_staus_id"]')[0];
				var statusFieldEl = status_field.bodyEl;
				var msgStatus = 'Connection error while checking endpoints.<br>Local endpoint will be used'

				status_field.setValue('<span style="color: blue;font-weight: bolder;">'+msgStatus+'</span>');
				setTimeout(function () {
					statusFieldEl.fadeOut({
						opacity: 0, //can be any value between 0 and 1 (e.g. .5)
						easing: 'easeOut',
						duration: 2000,
						remove: false,
						useDisplay: false
					})
				}, 4000)
			}
		});
	}, // EO checkCoreAPI


/**
 * Init components' stores in order to use the proper endpoint to fetch the data
 * 
 */
	initComponents: function () {
		var protLookup = Ext.ComponentQuery.query(".combo-protein-lookup")[0]

		var comboSize = protLookup.getSize()
		console.log ("Northpanel onLaunch => size: "+comboSize.height+"x"+comboSize.width)

		var comboStore = protLookup.getStore()
//		comboStore.getProxy().url =
	}



})