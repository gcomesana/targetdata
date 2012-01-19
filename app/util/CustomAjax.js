/**
 * Ajax class with following feats:
 * - set a mask between the beginning and the end of the request
 */
Ext.define ("TD.util.CustomAjax", {
	extend: "Ext.data.Connection",
	singleton: true,

	bodyMasking: false,
	maskMsg: '',

	listeners: {
		beforerequest: {
			fn: function () {
				if (this.bodyMasking == true) {
					console.info ("CustomAjax beforerequest: "+this.bodyMasking)
					Ext.getBody().mask(this.maskMsg)
				}
				else
					console.info ("CustomAjax beforerequest with no masking")
			}
		},

		requestcomplete: {
			fn: function () {
				if (this.bodyMasking) {
					console.info ("CustomAjax requestcomplete")
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