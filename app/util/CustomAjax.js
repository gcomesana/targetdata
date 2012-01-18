/**
 * Ajax class with following feats:
 * - set a mask between the beginning and the end of the request
 */
Ext.define ("TD.util.CustomAjax", {
	extend: "Ext.data.Connection",
	singleton: true,
	
	listeners: {
		beforerequest: {
			fn: function () {
				console.info ("CustomAjax beforerequest")
			}
		},

		requestcomplete: {
			fn: function () {
				console.info ("CustomAjax requestcomplete")
			}
		},

		requestexception: {
			fn: function () {
				console.info ("CustomAjax requestexception")
			}
		}
	} // EO constructor

})