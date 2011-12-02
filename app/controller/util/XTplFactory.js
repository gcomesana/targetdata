

// Ext.require (["TD.view.tab.InfoFieldset", "TD.view.tab.TargetGenericPanel", "TD.view.tab.TargetInfoPanel"])
Ext.define ("TD.controller.util.XTplFactory", {

	statics: {
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

	} // EO statics

})