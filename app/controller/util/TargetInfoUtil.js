/**
 * This class is intended as an utility class to retrieve and format
 * the information gathered from different sources for the target description
 * tabpanel.
 */
// TODO Refactorizar esto porque se está yendo de madre. Otra clase y/o ver los static
Ext.require (["TD.view.tab.InfoFieldset", "TD.view.tab.TargetGenericPanel", "TD.view.tab.TargetInfoPanel"])
Ext.define ("TD.controller.util.TargetInfoUtil", {
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
//			properUrl = "resources/data/p23486new.json"
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

// Set the title as a HTML template (XTemplate)
					var view = Ext.ComponentQuery.query ('#infoPanel')
					var infoTab = Ext.ComponentQuery.query ('viewport > panel > targetinfo')
					var emptyJson = {uniprotId: opts.params.id}
					tpl = self.createTitleInfoXTpl ()
//					tpl.overwrite(infoTab[0].body, emptyJson)

// Check whether or not the response is empty
					if (response.responseText.length == 0) {
						tpl = self.createEmptyTpl(opts.params.id)
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

// create the citation panel and "cache" the template, which will be rendered
// when rendering the panel
							/*
							var citationObj = TargetInfoCls.citationInfo(entryOne, 0)
							var citPanel = Ext.widget("targetinfo", {
								id: "citation-"+accession,
								tpl: self.createCitationXTpl (),
//								tplObj: citationObj,
								title: "Citations"
							})
							*/

							var fieldsetTit = '<div class="fieldset-nfo-title">'+accession+'</div>'
							var newFieldSet = Ext.widget("targetinfo-fs", {
								title: fieldsetTit,
								id: accession+"-fieldset"
							})
//							var added = newFieldSet.add(citPanel)
							var infoPanelTit = "Info for Uniprot acc <i>"+accession+"</i>"
							var infoPanel = Ext.create ("TD.view.tab.TargetInfoPanel", {
								id: "uniprotInfo-"+accession,
								tpl: self.createInfoXTpl(),
								tplObj: myJsonObj,
								title: infoPanelTit,
								collapsed: false
							})
							added = newFieldSet.add(infoPanel)

//							tpl = self.createInfoXTpl ()
//							tpl.overwrite(infoPanel.getEl(), myJsonObj)
							view[0].add(infoPanel)
							infoPanel.tpl.addListener('divSeq')
						}
						catch (e) {
							console.error (e.name)
							console.error (e.message)
						}
//						tpl.append(view[0].body, myJsonObj)
					}
					Ext.getBody().unmask()

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

			newJsonStr += '"shortSeq":"'+seq.substr(0, 18)+'...",'
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

			var organism
			organism = JSONSelect.match('.organism .name :has(._at_type:val("common"))', jsonObj)
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

/*
var resultTpl = new Ext.XTemplate(
	'<tpl for=".">',
	'<div class="search-item">',
	'<a id={[this.getLinkId()]} href="violation.aspx?violationid={slvha}">',
	'<img src="images/icons/home.gif" style="float:left;padding-right:2px">{number}&nbsp;{street}',
	'</a>',
	'<p>Owners:&nbsp;{owners}',
	'<br/>Flag Code:&nbsp;{flag}',
	'<br/>Number of Violations:&nbsp;[{summary}]</p>',
	'</div>',
	'</tpl>', {
		getLinkId: function(values) {
			var result = Ext.id();
			this.addListener.defer(1, this, [result]);
			return result;
		},
		addListener: function(id) {
			Ext.get(id).on('click', function(e) {
				e.stopEvent();
				alert('link ' + id + ' clicked');
			})
		}
	})
*/

/**
 * Creates a XTemplate to display the result of a successful uniprot request
 */
		createInfoXTpl: function () {
			var tpl = new Ext.XTemplate (
				'<div id="divNames"class="nameCat">Name</div>',
				'<div class="infoJson">{fullName}',
				'<tpl if="shortName != &quot;&quot;"> ({shortName})</tpl>',
				'<br/><small>(<i>{existence}</i>)</small>',
				'</div>',
				'<div id="divSeq" class="sequence">{shortSeq}</div>',
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
				'</tpl>', {
					addListener: function(id) {
						Ext.get(id).on('click', function(e) {
							e.stopEvent();
							alert('link ' + id + ' clicked');
						})
					} // addListener
				}
			)
			return tpl
		}, // EO createXTemplate










/**
 * Retrieve the information about citations, if exist, from the uniprot json object.
 * Also, retrieves the abstract of the papers by ajax-requesting to entrez.
 * Only citations with entrez reference number will be listed (they are
 * considered as the trustworthy ones)
 */
		citationInfo: function (jsonObj, entryIdx) {

			var entrezJson = []
			var citations = JSONSelect.match(".reference .citation", jsonObj)
			var pubmedCits = JSONSelect.match (".dbReference :has(._at_type:val(\"PubMed\"))", citations)
			var numPubmedCits = pubmedCits.length

			Ext.Array.each(pubmedCits, function (item, index, cits) {
				// get info from pubmed
				Ext.Ajax.request({
					url: "resources/data/pubmedEntry.json",
// http://www.ncbi.nlm.nih.gov/pubmed/2111111 -2111111- del json de uniprot
					
					mehtod: "GET",

					failure: function (response, opts) {
						console.error ("Error in ajax call")
						console.error (response)
					},

					success: function (response, opts) {
						console.info ("index inside citation ajax: "+index)
					}
				})
			})
	
			console.info (pubmedCits.length)

			return entrezJson
		},


	/**
	 * Create the template to display the citations. Gets the right json object to
	 * "feed" the template from the citationInfo method
	 *
	 * @param jsonObj, the object for the current accession
	 */
		createCitationXTpl: function (jsonObj) {
			var citJson = TD.controller.util.TargetInfo.citationInfo(jsonObj)

			var tpl = new Ext.XTemplate (
				'<div id="divNames"class="nameCat">Citation</div>'
			)
			return tpl
		}
		
	}, // EO statics



/**
 * Retrieves information of related sources by ajax-requestion to several sources
 * via custom cgi scripts
 */
	referencesInfo: function () {


	} // EO referencesInfo

})