
(function() {
	Ext.Loader.setConfig({
		enabled : true,
		disableCaching: false,
		paths	 : {
			"TD": 'app',
			"Ext.ux": "extjs4.0.2/ux"
		}
	});

	

//	Ext.require ("Ext.grid.Panel")
	Ext.require ("TD.view.UsersGrid")

	var translateJson = function (myJson) {
		var jsonObj = Ext.JSON.decode (myJson)
		var newJsonStr = "{"

		var fullName = JSONSelect.match (".uniprot .entry .protein .recommendedName .fullName .$t", jsonObj)
		if (fullName.length > 0) {
			console.info ("fullName: "+fullName[0])
			newJsonStr += '"fullName": "'+fullName[0]+'",'
		}
		else
			newJsonStr += '"fullName": "",'

		var shortName = JSONSelect.match (".uniprot .entry .protein .recommendedName .shortName .$t", jsonObj)
		if (shortName.length > 0) {
			console.info ("shortName: "+shortName[0])
			newJsonStr += '"shortName": "'+shortName[0]+'",'
		}
		else
			newJsonStr += '"shortName": "",'

// geneName is an array of two arrays, as ...name is an array and
// JSONSelect returns always arrays
		var geneName = JSONSelect.match(".uniprot .entry .gene .name", jsonObj)
		var geneNames = geneName[0] // this is another array!!!

		console.info ("** Gene names!!!")
		newJsonStr += '"geneNames":['
		Ext.Array.each(geneNames, function (item, index, genes) {
			newJsonStr += '{'
			for (var key in item) {
				console.info (key+"-"+item[key])
				newJsonStr += '"'+key+'":"'+item[key]+'",'
			}
			newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
			newJsonStr += "},"
		})
// sometimes geneNames is an array and sometimes is an object...
		if (geneNames.length > 0 || Ext.isArray(geneNames) == false)
			newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
		newJsonStr += "],"

		var organism = JSONSelect.match(".uniprot .entry .organism .name :has(.@type:val(\"common\"))", jsonObj)
		var organismCommon = organism.length > 0? organism[0]: ''
		console.info ("Common name: "+organismCommon.$t)
		newJsonStr += '"organismName": "'+organismCommon+'",'

		var comment = JSONSelect.match(".uniprot .entry .comment :has(.@type:val(\"function\"))", jsonObj)
		var commentFunc = comment.length > 0? comment[0].text.$t: ''
		console.info ("FUNCTION: "+commentFunc)
		newJsonStr += '"function": "'+commentFunc+'"}'

		console.info ("** newJSON: "+newJsonStr)
	}




	Ext.Ajax.request({
		url: "resources/data/p87326.json",
		success: function (response, opts) {
			translateJson (response.responseText)
		},


		failure: function (response, opts) {
			console.error ("Error in ajax call")
			console.error (response)
		}

	})



	Ext.application({
		name: "TD",
		appFolder: "app",

		launch: function() {
			console.info("launchinnggggggggggg")
//				var userWin = Ext.create('widget.editorwindow')
//				userWin.show();
			Ext.QuickTips.init();

			var viewport = Ext.create('Ext.Viewport', {

				items: [{
					xtype: "panel",
//					html: "<h1>Hello fucking panel :-S</h1>",
					height: 200,
					layout: "hbox",
					title: "Panel w/ hbox!!",
					width: 500,
					items: [{
						xtype: "grid",
						title: "myUsers",
						store: TD.store.UserStore,
						columns: [
							{ header: "the id", dataIndex: "id" },
							{ header: "the name", dataIndex: "name" },
							{ header: "the email", dataIndex: "email" }
						] // EO columns

					}] // EO panel items
				}, {
					xtype: "usersgrid"
				}] // EO items
			}) // EO Viewport
		} // EO launch
	}) // EO Application

})();