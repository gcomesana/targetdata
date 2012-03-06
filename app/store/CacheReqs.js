

Ext.define ("TD.store.CacheReqs", {
	extend: "Ext.data.Store",

	storeId: "cache-store",
	model: 'TD.model.CacheReq'
/*
	proxy: {
		type: 'localstorage',
		id: "requests-cache"
	}
*/
})