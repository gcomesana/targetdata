/**
 * This class is intended as an utility class to retrieve and format
 * the information gathered from different sources for the target description
 * tabpanel.
 */
// TODO Refactorizar esto porque se está yendo de madre. Otra clase y/o ver los static
Ext.require (["TD.view.tab.InfoFieldset", "TD.view.tab.TargetGenericPanel",
							"TD.view.tab.TargetInfoPanel", "TD.controller.util.XTplFactory",
							"TD.util.CustomAjax"])
Ext.define ("TD.controller.util.TargetInfoUtil", {

	statics: {

		hostLocal: ["localhost", "lady-qu"],
		hostProd: ["ws.bioinfo.cnio.es"],

		urisLocal: [
			{"cat":"uniprot", "url": "/cgi-bin/uniFetcher.pl"},
			{"cat":"pubmedAbstrac", "url": "/cgi-bin/togoAbstractFetch.pl"}
		],

		urisProd: [
			{"cat":"uniprot", "url":"/cgi-bin/uniFetcher.pl"},
			{"cat":"pubmedAbstrac", "url": "/cgi-bin/togoAbstractFetch.pl"}
		],

		uniprotJson: {},
/**
 * Get the main target information from the uniprot json object via an ajax call
 * @param id, the uniprot id to retrieve the target
 */
		uniprotReq: function (id) {
			var self = this
			var uniprotId = id

			var properUrl = self.getProperUri()
//			properUrl = "resources/data/p62258.json"
//			Ext.Ajax.request({
			TD.util.CustomAjax.bodyMasking = true
			TD.util.CustomAjax.maskMsg = 'Sending Uniprot request...'
			TD.util.CustomAjax.request ({
	//			url: "http://ws.bioinfo.cnio.es/OpenPHACTS/cgi-bin/uniFetcher.pl",
				url: "/cgi-bin/uniFetcher.pl",
				url: properUrl,
				params: {
					id: uniprotId
				},
				method: "GET",

				success: function (response, opts) {
					var tpl

// Set the title as a HTML template (XTemplate)
					var view = Ext.ComponentQuery.query ('#infoPanel')
					var infoTab = Ext.ComponentQuery.query ('viewport > panel > targetinfo')
					var emptyJson = {uniprotId: opts.params.id}
//					tpl = self.createTitleInfoXTpl ()
					tpl = TD.controller.util.XTplFactory.createTitleInfoXTpl()
//					tpl.overwrite(infoTab[0].body, emptyJson)

// Check whether or not the response is empty
					if (response.responseText.length == 0) {
//						tpl = self.createEmptyTpl(opts.params.id)
						tpl = TD.controller.util.XTplFactory.createEmptyTpl()
						tpl.append(view[0].body, {})
					}
					else {
// For each entry JSONSelect.match (".entry", jsonObj)
// create a fieldset for it
// for each fieldset, create a targetinfo for information and citation
// and, if so, for database references...
						var TargetInfoCls = TD.controller.util.TargetInfoUtil
						var jsonObj = Ext.JSON.decode (response.responseText)
						jsonObj.uniprotId = opts.params.id
						self.uniprotJson = jsonObj

// Get the number of entries for this response
						var entries = JSONSelect.match (".entry", jsonObj)[0]
						var numEntries = entries.length
						var entryOne = numEntries != undefined? entries[0]: entries

// Translate the json object into one useful for us
						var myJsonObj = TargetInfoCls.translateJson (entryOne, 0)
						myJsonObj.uniprotId = opts.params.id

// The point in the next piece of code is create a target fieldset and
// then create the panels to embed into the fieldset
// Repeat for each accession retrieved from uniprot json/xml
						try {
							var accessions = JSONSelect.match (".accession", jsonObj)
							var accession = (accessions[0].length)? accessions[0][0]._text_: accessions[0]._text_
							var emptyMsg = 'No information available from Uniprot for id ????'
//							var added = newFieldSet.add(citPanel)
							var infoPanelTit = "Info for Uniprot acc <i>"+accession+"</i>"
							var infoPanel = Ext.create ("TD.view.tab.TargetInfoPanel", {
								id: "uniprotInfo-"+accession,
//								tpl: self.createInfoXTpl(),
								tpl: TD.controller.util.XTplFactory.createInfoXTpl(myJsonObj),
								emptyTpl: TD.controller.util.XTplFactory.createEmptyTpl(emptyMsg, accession),
								tplObj: myJsonObj,
								numItems: 1,
								emptyObjThreshold: 0,
								title: infoPanelTit,
								collapsed: false,
								collapsible: false,
								autoScroll: true,

								height: 600,
//								maxWidth: 780,
								minWidth: 800,
								width: 800
							})
							view[0].add(infoPanel)
//							var uniprotObj = TD.controller.util.TargetInfoUtil.uniprotJson
//							var seq = JSONSelect.match (".sequence ._text_", uniprotObj)
							infoPanel.tpl.createToolTip(JSONSelect.match(".sequence ._text_", jsonObj)[0])

							var tabPanel = Ext.getCmp("centerTabs")
							var tabItems = tabPanel.items.items
							Ext.each (tabItems, function (item, index, elems) {
								item.setDisabled(false)
								if (index == 0)
									tabPanel.setActiveTab(item)
							})
						}
						catch (e) {
							console.error (e.name)
							console.error (e.message)
						}
//						tpl.append(view[0].body, myJsonObj)
					}
//					Ext.getBody().unmask()
				}, // EO success


				failure: function (response, opts) {
					console.error ("Error in ajax call")
					console.error (response)
				}
			})
		}, // EO uniprotReq



	/**
	 * Custom method to convert the uniprot json into a json object with the
	 * right elements to represent as a target information
	 * @param myJson, the json object already converted from the text received
	 * from uniprot cgi script as text
	 * @param entryIndex, this parameter is used to get a particular entry when in a file
	 * several entries can be found.
	 */
		translateJson: function (myJson, entryIndex) {
	//		var jsonObj = Ext.JSON.decode (myJson)
			var jsonObj = myJson
			var newJsonStr = "{"

			if (entryIndex == undefined)
				entryIndex = 0

			var fullName = JSONSelect.match (".protein .recommendedName .fullName ._text_", jsonObj)
//				JSONSelect.match (".uniprot .entry .protein .recommendedName .fullName ._text_", jsonObj)
			if (fullName.length > 0) {
				newJsonStr += '"fullName": "'+fullName[entryIndex]+'",'
			}
			else
				newJsonStr += '"fullName": "",'

			var shortName =
				JSONSelect.match (".protein .recommendedName .shortName ._text_", jsonObj)
			if (shortName.length > 0) {
				newJsonStr += '"shortName": "'+shortName[entryIndex]+'",'
			}
			else
				newJsonStr += '"shortName": "",'

// proteinExistence
			var protExist = JSONSelect.match(".proteinExistence ._at_type", jsonObj)
			newJsonStr += '"existence":"'+protExist+'",'

// sequence
			var seq = JSONSelect.match(".sequence ._text_", jsonObj)[0]
			var oldSeq = seq
			while (true) {
				seq = seq.replace ("\n", "") // remove \n and so
				if (oldSeq == seq)
					break
				
				oldSeq = seq
			}

			newJsonStr += '"shortSeq":"'+seq.substr(0, 68)+'...",'
			newJsonStr += '"seq":"'+seq+'",'

			var accessions = JSONSelect.match (".accession", jsonObj)
			var accession = (accessions[0].length)? accessions[0][0]._text_: accessions[0]._text_
			newJsonStr += '"accession":"'+accession+'",'

// geneName is an array of two arrays, as ...name is an array and
// JSONSelect returns always arrays
			var geneName = JSONSelect.match(".gene .name", jsonObj)
			if (geneName.length > 0) {
				var geneNames = geneName[0] // this is another array!!!

				newJsonStr += '"geneNames":['
				Ext.Array.each(geneNames, function (item, index, genes) {
					newJsonStr += '{'
					for (var key in item) {
						newJsonStr += '"'+key+'":"'+item[key]+'",'
					}
					newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
					newJsonStr += "},"
				})
		// sometimes geneNames is an array and sometimes is an object...
				if (geneNames.length > 0 || Ext.isArray(geneNames) == false)
					newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
				newJsonStr += "],"
			}



			var comment = JSONSelect.match(".comment :has(._at_type:val(\"function\"))", jsonObj)
			var commentFunc = comment.length > 0? comment[entryIndex].text._text_: ''
			newJsonStr += '"functionComment": "'+commentFunc+'",'

		
		
			var commSimilarity = JSONSelect.match('.comment :has(._at_type:val("similarity"))', jsonObj)
			var simLength = commSimilarity.length
			newJsonStr = simLength > 0? newJsonStr + '"similarity": [': newJsonStr;
			Ext.each (commSimilarity, function (item, index, elems) {
				var similarityTxt = item.text._text_
				newJsonStr += '"'+similarityTxt+'",'
			})
			if (simLength > 0) {
				newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
				newJsonStr += "],"
			}



			var commTissue = JSONSelect.match('.comment :has(._at_type:val("tissue specificity"))', jsonObj)
			var tissueLen = commTissue.length
//			newJsonStr = tissueLen > 0? newJsonStr + '"tissue": [': newJsonStr;
			if (tissueLen > 0) {
				newJsonStr += '"tissue": ['
				Ext.each (commTissue, function (item, index, elems) {
					var tissueTxt = item.text._text_
					newJsonStr += '"'+tissueTxt+'",'
				})

				newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
				newJsonStr += "],"
			}
			else
				newJsonStr += '"tissue":[],'


		
			var commLocation = JSONSelect.match('.comment :has(._at_type:val("subcellular location"))', jsonObj)
			if (commLocation.length > 0) {
				newJsonStr += '"subcellLocations":['
				Ext.each (commLocation[0].subcellularLocation, function (item, index, elems) {
					Ext.each (item, function (itemLocation, index, elems) {
						if (itemLocation.location._text_ != undefined)
							newJsonStr += '"'+itemLocation.location._text_+'",'
					})
					/*
					if (item.length) {
						Ext.each (item, function (itemLocation, index, elems) {
							newJsonStr += '"'+itemLocation.location._text_+'",'
						})
					}
					else
						newJsonStr += '"'+item.location._text_ + '",'
					*/
				})
				newJsonStr = newJsonStr.substr(0, newJsonStr.length-1)
				newJsonStr += "],"
			}
			else
				newJsonStr += '"subcellLocations":[],'



			var goTerms = JSONSelect.match('.dbReference :has(._at_type:val("GO"))', jsonObj)
			if (goTerms.length > 0)
				newJsonStr += this.getGoTerms (goTerms)

			var organism
			organism = JSONSelect.match('.organism .name :has(._at_type:val("common"))', jsonObj)
			var organismCommon = organism.length > 0? organism[entryIndex]._text_: ''
			newJsonStr += '"organismName": "'+organismCommon+'"'

			newJsonStr += "}"
	// OJO!!!!!!! Shouldn't be necessary (or yes...) but XTemplate don't support $ and @
			newJsonStr = newJsonStr.replace("$","", "g")
			newJsonStr = newJsonStr.replace("@", "", "g")

			var newJsonObj = Ext.JSON.decode (newJsonStr)
console.log (newJsonStr)
			return newJsonObj
		}, // EO translateJson



		getGoTerms: function (theGOTerms) {
			var goJsonStr = '"goTerms":['
			var newTerms = JSONSelect.match('.property :has(._at_type:val("term"))', theGOTerms)

			Ext.each (theGOTerms, function (item, index, elems) {
//				var goType = item._at_value.charAt(0)
				var goTerm = JSONSelect.match('.property :has(._at_type:val("term"))', item)
				var goType = goTerm[0]._at_value.charAt(0)

				if (goType == 'F') {
					goJsonStr += '{"type":"Molecular function","value":"'
					goJsonStr += goTerm[0]._at_value.substring(2, goTerm[0]._at_value.length)
					goJsonStr += '","id":"'+item._at_id+'"},'
				}
				else if (goType == 'P') {
					goJsonStr += '{"type":"Biological process","value":"'
					goJsonStr += goTerm[0]._at_value.substring(2, goTerm[0]._at_value.length)
					goJsonStr += '","id":"'+item._at_id+'"},'
				}
				else
					goJsonStr += ""
			})

			if (goJsonStr.indexOf("[") == goJsonStr.length-1)
				goJsonStr += "],"
			else
				goJsonStr = goJsonStr.substr(0, goJsonStr.length-1) + "],"
			
			return goJsonStr
		},



		getProperUri: function () {
			var host = window.location.hostname
			var isLocalhost = function(elem, index, array) { return elem == host }
			var uris = this.hostLocal.some (isLocalhost)?
									this.urisLocal:
									this.urisProd

			var uri = uris.filter(function (elem, index, array) {
				return elem.cat == "uniprot"
			})
			return uri[0].url
		} // EO getProperUri

	} // EO statics


})