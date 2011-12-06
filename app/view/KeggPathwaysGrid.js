

Ext.define ("TD.view.KeggPathwaysGrid", {
	extend: "Ext.grid.Panel",
	alias: "widget.pathways-grid",
	requires: ["TD.store.KeggPathways"],

	title: 'Pathways',
//	store: Ext.data.StoreManager.lookup('keggpathways-store'),
//	store: "TD.store.KeggPathways",
	
	columns: [
			{header: 'Pathway Name', dataIndex: 'pathway', flex:1}
	],
	height: 400,
	width: 400,
	name: "grid-paths",
	id: "grid-paths"
/*
	listeners: {
		selectionchange: function (aView, selections, opts) {
			Ext.each (selections, function (sels, index, item) {
				console.info ("selection: "+index+" -> "+item[0].data.pathway)
			})
		}

	} // EO listeners
*/
})