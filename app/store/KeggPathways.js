

Ext.define ("TD.store.KeggPathways", {
	extend: "Ext.data.Store",

		proxy: {
			type: "ajax",
//			url: "resources/data/p53-paths.json",
			url: "/cgi-bin/get_pathways.rb",
			extraParams: {
				protein: "P62258"
			},

			reader: {
				type: "array"
			}
		},
		model: "TD.model.KeggPathway",
//		fields: ["pathway"],
		autoLoad: true,
		storeId: "keggpathways-store"
})