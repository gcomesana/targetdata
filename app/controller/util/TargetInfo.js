/**
 * This class is intended as an utility class to retrieve and format
 * the information gathered from different sources for the target description
 * tabpanel.
 */
Ext.define ("TD.controller.util.TargetInfo", {

	uniprotJson: {},

	statics: {

		hostLocal: ["localhost", "lady-qu"],
		hostProd: ["ws.bioinfo.cnio.es"],

		urisLocal: [
			{"cat":"uniprot", "url": "/cgi-bin/uniFetcher.pl"},
			{"cat":"pubmedAbstrac", "url": "/cgi-bin/togoAbstractFetch.pl"}
		],

		urisProd: [
			{"cat":"uniprot", "url":"cgi-bin/uniFetcher.pl"},
			{"cat":"pubmedAbstrac", "url": "cgi-bin/togoAbstractFetch.pl"}
		],


/**
 * Get the main target information from the uniprot json object via an ajax call
 * @param id, the uniprot id to retrieve the target
 */
		uniprotReq: function (id) {
			var self = this
			var uniprotId = id

			var properUrl = self.getProperUri()
			properUrl = "resources/data/p23486new.json"
			Ext.Ajax.request({
	//			url: "http://ws.bioinfo.cnio.es/OpenPHACTS/cgi-bin/uniFetcher.pl",
	//			url: "/cgi-bin/uniFetcher.pl",
				url: properUrl,
				params: {
					id: uniprotId
				},
				method: "GET",


				success: function (response, opts) {
					var tpl

// Get the main info from uniprot
					var view = Ext.ComponentQuery.query ('viewport > panel > targetinfo > panel[id="uniprotInfo"]')
					var infoTab = Ext.ComponentQuery.query ('viewport > panel > targetinfo')
					var emptyJson = {uniprotId: opts.params.id}
					tpl = self.createTitleInfoXTpl ()
					tpl.overwrite(view[0].body, emptyJson)

					if (response.responseText.length == 0) {
						tpl = self.createEmptyTpl(opts.params.id)
						tpl.append(view[0].body, {})
					}
					else {
						var jsonObj = Ext.JSON.decode (response.responseText)
						jsonObj.uniprotId = opts.params.id
						self.uniprotJson = jsonObj

						var entries = JSONSelect.match (".entry", jsonObj)[0]
						var myJsonObj = TD.controller.util.TargetInfo.translateJson (jsonObj)
						myJsonObj.uniprotId = opts.params.id
						try {
							tpl = self.createInfoXTpl ()
						}
						catch (e) {
							console.error (e.name)
							console.error (e.message)
						}
						tpl.append(view[0].body, myJsonObj)
					}

					Ext.getBody().unmask()
					var contentTabs = Ext.ComponentQuery.query ('viewport > tabpanel[itemId="contentTabPanel"]')
					contentTabs[0].setActiveTab(0)
					var infopanels = Ext.ComponentQuery.query ('viewport > tabpanel > targetinfo > panel')
					Ext.Array.each (infopanels, function (item, index, panelsItself) {
						item.setVisible(true)
					})
				}, // EO success


				failure: function (response, opts) {
					console.error ("Error in ajax call")
					console.error (response)
				}
			})
		}, // EO uniprotReq



// TODO esto tiene que ser generalizado según puede haber varias entradas en el json
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

			var fullName =
				JSONSelect.match (".uniprot .entry .protein .recommendedName .fullName ._text_", jsonObj)
			if (fullName.length > 0) {
				newJsonStr += '"fullName": "'+fullName[entryIndex]+'",'
			}
			else
				newJsonStr += '"fullName": "",'

			var shortName =
				JSONSelect.match (".uniprot .entry .protein .recommendedName .shortName ._text_", jsonObj)
			if (shortName.length > 0) {
				newJsonStr += '"shortName": "'+shortName[entryIndex]+'",'
			}
			else
				newJsonStr += '"shortName": "",'

	// geneName is an array of two arrays, as ...name is an array and
	// JSONSelect returns always arrays
			var geneName = JSONSelect.match(".uniprot .entry .gene .name", jsonObj)
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

			var comment = JSONSelect.match(".uniprot .entry .comment :has(._at_type:val(\"function\"))", jsonObj)
			var commentFunc = comment.length > 0? comment[entryIndex].text._text_: ''
			newJsonStr += '"functionComment": "'+commentFunc+'",'

			var organism
			organism = JSONSelect.match('.uniprot .entry .organism .name :has(._at_type:val("common"))', jsonObj)
			var organismCommon = organism.length > 0? organism[entryIndex]._text_: ''
			newJsonStr += '"organismName": "'+organismCommon+'",'

			newJsonStr += "}"
	// OJO!!!!!!! Shouldn't be necessary (or yes...) but XTemplate don't support $ and @
			newJsonStr = newJsonStr.replace("$","", "g")
			newJsonStr = newJsonStr.replace("@", "", "g")

			var newJsonObj = Ext.JSON.decode (newJsonStr)

			return newJsonObj
		}, // EO translateJson




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
		}, // EO getProperUri



/**
 * Creates a XTemplate for a empty response of a uniprot request.
 * @param reqId, the requested id which does not have any uniprot entry
 */
		createEmptyTpl: function (reqId) {
			var tpl = new Ext.XTemplate (
				'<div class="infoJson">There is no result for the requested Uniprot id ('+reqId+').</div>'
			)
			return tpl
		},



/**
 * Creates a title with the uniprot id requested and the additinal accession
 * numbres if the xml file holds more than one
 */
		createTitleInfoXTpl: function () {
			var tpl = new Ext.XTemplate (
				'<div id="divTit" class="uniprotId">Uniprot Id {uniprotId}</div>'
			)
			return tpl
		},


/**
 * Creates a XTemplate to display the result of a successful uniprot request
 */
		createInfoXTpl: function () {
			var tpl = new Ext.XTemplate (
				'<div id="divNames"class="nameCat">Name</div>',
				'<div class="infoJson">{fullName}',
				'<tpl if="shortName != &quot;&quot;"> ({shortName})</tpl>',
				'</div>',
				'<tpl if="geneNames.length &gt; 0">',
				'<div id="divGenes" class="nameCat">Genes</div>',
				'<tpl for="geneNames">',
					'<li class="infoList">{_text_} (<i>{_at_type}</i>)</li>',
				'</tpl>',
				'</div>',
				'</tpl>', // EO if geneNames.length
				'<tpl if="organismName != &quot;&quot;">',
				'<div id="divOrganism" class="nameCat">Organism</div>',
				'<div class="infoJson">{organismName}</div>',
				'</tpl>',

				'<tpl if="functionComment != &quot;&quot;">',
				'<div id="divFunction" class="nameCat">Function</div>',
				'<div class="infoJson">{functionComment}</div>',
				'</tpl>'

			)
			return tpl
		} // EO createXTemplate
	},


	createCitationXTpl: function () {
		

	},

/**
 * Retrieve the information about citations if exist in uniprot json object.
 * Also, retrieves the abstract of the papers by ajax-requesting togows
 */
	citationInfo: function () {


	},


/**
 * Retrieves information of related sources by ajax-requestion to several sources
 * via custom cgi scripts
 */
	referencesInfo: function () {


	} // EO referencesInfo

})