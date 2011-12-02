

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
		citationInfo: function () {

			var jsonObj = TD.controller.util.TargetInfoUtil.uniprotJson
	if (jsonObj == undefined || jsonObj == null)
		console.info ("jsonObj in XTplFactory is "+jsonObj)
			var entrezJson = []
			var citations = JSONSelect.match(".reference .citation", jsonObj)
			var pubmedCits = JSONSelect.match (".dbReference :has(._at_type:val(\"PubMed\"))", citations)
			var numPubmedCits = pubmedCits.length

// not all references are citations with pubmed, more handy JSONSelect in this case
			var numCitations = jsonObj.uniprot.entry.reference.length

// from citations, check if pubmed entry is inside dbreference
			Ext.each (citations, function (cita, index, cits) {
				var pubmedExists = JSONSelect.match (".dbReference :has(._at_type:val(\"PubMed\"))", cita)
				if (pubmedExists != undefined && pubmedExists != null && pubmedExists.length > 0)
					entrezJson.push(cita)
			})

			return entrezJson
		},


	/**
	 * Create the template to display the citations. Gets the right json object to
	 * "feed" the template from the citationInfo method
	 *
	 * @param panelHeight, this is the height of the panel as 
	 */
		createCitationXTpl: function (panelHeight) {
//			var citJson = TD.controller.util.TargetInfoUtil.uniprotJson
//			citJson = TD.controller.util.XTplFactory.citationInfo(citJson)

			var xTpl = new Ext.XTemplate (
				'<div id="divNames"class="citationTit">Publications from PubMed</div>',
				'<div id="divCitations" style="overflow: scroll;height: '+(panelHeight-20)+'px">',
				'<tpl for=".">',
				'<a href="',
				'<tpl for="dbReference">',
				'<tpl if="_at_type == \'PubMed\'">http://www.ncbi.nlm.nih.gov/pubmed?term={_at_id}',
				'" target="_blank" style="text-decoration:none"></tpl>',
				'</tpl>', // dbReference
				'<div id="divCit" class="{[xindex % 2 === 0 ? "citation-even" : "citation-odd"]}">',
				'<tpl for="authorList.person">{_at_name},</tpl><tpl if="this.hasAuthors(authorList.person)"><br/></tpl>',
				'<b>{title._text_}</b><br/>',
				'<i>{_at_name}</i> {_at_volume} ({_at_date})',
				'</div></a>',
				'</tpl>', // first for
				'</div>', {
					hasAuthors: function (authorList) {
						return (authorList.length > 0)
					},

					mouseOver: function () {
						console.info ("on mouse over...")
						Ext.get(id).on('click', function(e) {
							e.stopEvent();
							alert('link ' + id + ' clicked');
						})
					}
				}
			)

			return xTpl
		}

	} // EO statics

})


/*
	'<div id="divNames"class="nameCat">Publications from PubMed</div>',
				'<tpl for=".">',
				'<a href="',
				'<tpl for="dbReference">',
				'<tpl if="_at_type == \'PubMed\'">http://www.ncbi.nlm.nih.gov/pubmed?term={_at_id}',
				'</tpl>', // dbReference
				'" target="_blank">',
				'<div id="divCit">',
				'<tpl for="authorList.person">{_at_name},</tpl><br/>',
				'<b>{title._text_}</b><br/>',
				'<i>{_at_name}</i> {_at_volume} ({_at_date})',
				'</a></div>',
				'</tpl>' // first for
*/