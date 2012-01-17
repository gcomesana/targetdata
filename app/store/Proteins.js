
Ext.define ("TD.store.Proteins", {
	extend: "Ext.data.Store",
	requires: ["TD.model.Protein"],

	model: "TD.model.Protein",

	proxy: {
		type: "ajax",
		url: "resources/data/p12345.xml",
		reader: {
			type: "xml",
			record: "alternativeName",
			root: "protein"
		}
	}
	
})