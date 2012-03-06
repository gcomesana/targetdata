
Ext.define ("TD.model.CacheReq", {
	extend: "Ext.data.Model",

	fields: [
		{ name: 'id', type: 'int' },
		{ name: 'url', type: 'string' },
		{ name: 'jsonresp', type: 'string' }
	],

	associations: [
    {type: 'hasMany', model: 'TD.model.CacheReqParam',  name: "params" }
	],
	// above, name is the name of the function to get the params: item.params()

	proxy: {
		type: 'localstorage',
		id: "requests-cache"
	}
	
})