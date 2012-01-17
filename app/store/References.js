
Ext.define("TD.store.References", {
	extend: "Ext.data.Store",
	model: "TD.model.Reference",

	proxy: {
		type: "ajax",
		url: "resources/data/p12345.xml",
		reader: {
			type: "xml",
			record: "reference"
		}
	}

})