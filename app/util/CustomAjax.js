/**
 * Ajax class with following feats:
 * - set a mask between the beginning and the end of the request
 */
Ext.define ("TD.util.CustomAjax", {
	extend: "Ext.data.Connection",
	singleton: true,
	requires: ['TD.model.CacheReqParam','TD.model.CacheReq','TD.store.CacheReqs'],

	bodyMasking: false,
	maskMsg: '',

	requestCache: null, // the cache store

	isRequestFinished: true,


	init: function (config) {
		var myConfig = config || {}

// init the cacheStore
		requestCache = new TD.store.CacheReqs()
		if (config.clearCache)
			requestCache.getProxy().clear()
		else
			requestCache.load ()

		requestCache.sync()
		this.callParent(myConfig)
	},


/**
 * Override the <i>request</i> method in order to deal with the requests cache
 * before doing the actual request.
 * @param opts, the request options as defined in ExtJS 4 API docs
 */
	request: function (opts) {
		var myUrl = opts.url
		var myParams = opts.params

		var cacheResp = this.fetchRequest (myUrl, myParams)
		if (!cacheResp)
			this.callParent(arguments)

		else {
			var myResp = {}
			myResp.responseText = cacheResp.jsonresp
			this.fireEvent('requestcomplete', this, myResp, opts)
		}
	},



	fetchRequest: function (url, params) {
		return false;
	},
	

	listeners: {
		beforerequest: {
			fn: function (conn, opts) {
				if (this.bodyMasking == true) {
//					console.info ("CustomAjax beforerequest: "+this.bodyMasking)
					Ext.getBody().mask(this.maskMsg)
				}
				else
					console.info ("CustomAjax beforerequest with no masking")
			}
		},

		requestcomplete: {
			fn: function (conn, response, opts) {
				if (this.bodyMasking) {
//					console.info ("CustomAjax requestcomplete")
					Ext.getBody().unmask()
				}
			}
		},

		requestexception: {
			fn: function () {
				console.info ("CustomAjax requestexception")
			}
		}
	} // EO constructor

})