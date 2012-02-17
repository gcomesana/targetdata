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
console.log("TD.util.CustomAjax.init")
		var myConfig = config || {}

// init the cacheStore
		this.cacheInit(config.clearCache)

//		this.callParent(myConfig)
	},



	cacheInit: function (clearCache) {
console.log("TD.util.CustomAjax.cacheInit")
		this.requestCache = new TD.store.CacheReqs()
		if (clearCache)
			this.requestCache.getProxy().clear()
		else
			this.requestCache.load ()

		this.requestCache.sync()
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




/**
 * Fetches the jsonResp associated with the given request, defined by the url
 * and the query string params
 * @param theUrl
 * @param params, the query string params as a object ({param1:val1,param2:val2,...})
 */
	fetchRequest: function (theUrl, theParams) {

		this.requestCache.filter ('url', theUrl)



		var join = function (rec) {
			var recParams = rec.params();
			var joinOk = true;
			recParams.each (function (recParam) {
				var paramName = recParam.get('name')
				joinOk = theParams[paramName] == recParam.get('value') && joinOk;

				if (!joinOk)
					return false;
			})
			return joinOk
		}


		this.requestCache.filterBy (function (record, idRec) {
//			var urlOk = record.get('url') == theurl
			var recordOk = join (record)
			return recordOk
		})

		if (this.requestCache.getCount() == 0)
			return null;
		else {
			var choice = this.requestCache.getAt(0);
			return choice.get('jsonresp');
		}
	},




/**
 * Add the current request to the cache
 * @param opts, the opts (url, params, ...)
 * @param jsonResp, the jsonresp
 */
	addToCache: function (opts, jsonResp) {
		var theurl = opts.url
		var theParams = opts.params

		var record = new TD.model.CacheReq ({url:theurl, jsonresp:jsonResp})
		for (param in theParams) {
			var pName = param
			var pValue = theParams[param]

			var newParam = new TD.model.CacheReqParam ({name:pName, value:pValue})
			record.params().add(newParam)
		}

		this.requestCache.add (record)
		this.requestCache.sync()
	},



	listeners: {
		beforerequest: {
			fn: function (conn, opts) {
				console.info ("TD.util.CustomAjax.listeners.beforerequest")
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
				console.info ("TD.util.CustomAjax.listeners.requestcomplete")
				if (this.bodyMasking) {
//					console.info ("CustomAjax requestcomplete")
					Ext.getBody().unmask()
				}
				var status = response.status

				if (status >= 200 && status <= 204)
					this.addToCache (opts, response.responseText)
			}
		},

		requestexception: {
			fn: function () {
				console.info ("CustomAjax requestexception")
			}
		}
	} // EO constructor

})