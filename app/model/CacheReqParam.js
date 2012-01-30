
Ext.define ("TD.model.CacheReqParam", {
	extend: "Ext.data.Model",

	fields: [
		{ name: "id", type: "int" },
		{ name: "name", type: "string" },
		{ name: "value", type: "string" },
		{ name: "cachereq_id", type: "int" }
	],

	belongsTo: 'TD.model.CacheReq',

	proxy: {
		type: 'localstorage',
		id: "param-requests"
	}
})