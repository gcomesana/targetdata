// http://www.ncbi.nlm.nih.gov/pubmed/4030726?report=xml

Ext.define("TD.controller.ButtonsCtrl", {
	extend: "Ext.app.Controller",

	stores: ["Proteins", "References"],
	models: ["Protein", "Reference"],

	views: ["ListKeywords"],

	init: function () {
		console.log ("loading controller...")
		this.control({
			"#btnNewTab": {
				click: this.createNewTab
			},
			"#btnGetProt": {
				click: this.getProtein
			}
		})
	},

	
	createNewTab: function () {
console.log ("creating new tab...")
		var tabpanel = Ext.ComponentQuery.query ("tabpanel")[0]
		var newTab = Ext.create("Ext.panel.Panel", {
			title: 'Third One',
			closable: true,
			autoScroll: true,
			html: "<div style=\"color:red\">IM the 3rd ONEEEEEEEE</div>"
		})
		tabpanel.add(newTab)

		return newTab
	},



	getProtein: function () {
console.log ("getting xml protein")

		var myNewTab = this.createNewTab()
		var tabs = Ext.ComponentQuery.query("tabpanel")[0]
//		myNewTab = myTabpanel.items.items[0]

		Ext.Ajax.request({
			url: "resources/data/p12345.xml",

			success: function (response) {
				var xmlRoot = response.responseXML

//				var xmlRef = Ext.DomQuery.select ("reference", xmlRoot)
//				var xmlDBRef = Ext.DomQuery.select ("dbReference", xmlRef)
				var xmlKw = Ext.query ("keyword", xmlRoot)

				var i=1
				var kwStore = [{"key":-1, "name":"keywords!!!"}]
				var storeData = "[{\"key\":-1, \"name\":\"keywords!!!\"},"
				Ext.each (xmlKw, function (elem, index, keywords) {
					storeData += "{\"key\":"+elem.attributes.id.nodeValue+", \"name\":\""+
						elem.textContent+"\"},"
					console.info ("#"+i+" .- ("+elem.attributes.id.nodeValue+") "+elem.textContent)
					kwStore.push ({"key":elem.attributes.id.nodeValue, "name":elem.textContent})
					i++
				})
				storeData = storeData.substring(0, storeData.length-1)
				console.info ("finished xml retrieving")
				console.info ("storeData: "+storeData)



				var gridkw = Ext.create("TD.view.GridKeywords", {
					store: kwStore
				})

				gridkw.on ("added", function (self, container, pos, opts) {
						console.info ("GRID WAS ADDDDDDDDDDDDDDDDDED")
//					self.reload()
					tabs.setActiveTab(container)
				})
				myNewTab.add(gridkw)

//				tabs.setActiveTab(myNewTab)
			}, // success

			failure: function () {
				console.log ("fail!!!")
			}

		})

/*
			catch (e) {
				console.info (e.name)
				console.info (e.message)
			}
console.log("EO getting xml uniprot")
*/


	}

})