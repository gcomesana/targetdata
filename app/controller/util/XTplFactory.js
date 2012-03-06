

// Ext.require (["TD.view.tab.InfoFieldset", "TD.view.tab.TargetGenericPanel", "TD.view.tab.TargetInfoPanel"])
Ext.define ("TD.controller.util.XTplFactory", {

	statics: {

/**
 * Creates a XTemplate for a empty response of a uniprot request.
 * @param msg, the message to display in the case of an empty resultset
 * @param reqId, the requested id which does not have any uniprot entry
 */
		createEmptyTpl: function (msg, reqId) {
			var strMsg = msg.replace ('????', reqId)
			var tpl = new Ext.XTemplate (
				'<div class="infoJson">'+strMsg+'</div>'
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
 * "functionComment": "Catalytic subunit of AMP-activated protein kinase (AMPK), an energy sensor protein kinase that plays a key role in regulating cellular energy metabolism. In response to reduction of intracellular ATP levels, AMPK activates energy-producing pathways and inhibits energy-consuming processes: inhibits protein, carbohydrate and lipid biosynthesis, as well as cell growth and proliferation. AMPK acts via direct phosphorylation of metabolic enzymes, and by longer-term effects via phosphorylation of transcription regulators. Also acts as a regulator of cellular polarity by remodeling the actin cytoskeleton; probably by indirectly activating myosin. Regulates lipid synthesis by phosphorylating and inactivating lipid metabolic enzymes such as ACACA, ACACB, GYS1, HMGCR and LIPE; regulates fatty acid and cholesterol synthesis by phosphorylating acetyl-CoA carboxylase (ACACA and ACACB) and hormone-sensitive lipase (LIPE) enzymes, respectively. Regulates insulin-signaling and glycolysis by phosphorylating IRS1, PFKFB2 and PFKFB3. AMPK stimulates glucose uptake in muscle by increasing the translocation of the glucose transporter SLC2A4/GLUT4 to the plasma membrane, possibly by mediating phosphorylation of TBC1D4/AS160. Regulates transcription and chromatin structure by phosphorylating transcription regulators involved in energy metabolism such as CRTC2/TORC2, FOXO3, histone H2B, HDAC5, MEF2C, MLXIPL/ChREBP, EP300, HNF4A, p53/TP53, SREBF1, SREBF2 and PPARGC1A. Acts as a key regulator of glucose homeostasis in liver by phosphorylating CRTC2/TORC2, leading to CRTC2/TORC2 sequestration in the cytoplasm. In response to stress, phosphorylates 'Ser-36' of histone H2B (H2BS36ph), leading to promote transcription. Acts as a key regulator of cell growth and proliferation by phosphorylating TSC2, RPTOR and ATG1: in response to nutrient limitation, negatively regulates the mTORC1 complex by phosphorylating RPTOR component of the mTORC1 complex and by phosphorylating and activating TSC2. In response to nutrient limitation, promotes autophagy by phosphorylating and activating ULK1. AMPK also acts as a regulator of circadian rhythm by mediating phosphorylation of CRY1, leading to destabilize it. May regulate the Wnt signaling pathway by phosphorylating CTNNB1, leading to stabilize it. Also has tau-protein kinase activity: in response to amyloid beta A4 protein (APP) exposure, activated by CAMKK2, leading to phosphorylation of MAPT/TAU; however the relevance of such data remains unclear in vivo. Also phosphorylates CFTR, EEF2K, KLC1, NOS3 and SLC12A1.",
    "similarity": [
        "Belongs to the protein kinase superfamily. CAMK Ser/Thr protein kinase family. SNF1 subfamily.",
        "Contains 1 protein kinase domain."
    ],
    "tissue": [],
    "subcellLocations": [
        "Cytoplasm",
        "Nucleus"
    ],
 */
		createInfoXTpl: function (newJsonObj) {
			var amigoURI = 'http://amigo.geneontology.org/cgi-bin/amigo/term_details?term='
			var bioProcesses = JSONSelect.match('.goTerms :has(.type:val("Biological process"))', newJsonObj).length
			var molFunctions = JSONSelect.match('.goTerms :has(.type:val("Molecular function"))', newJsonObj).length

			var tpl = new Ext.XTemplate (
				'<div id="divNames" class="nameCat">Name</div>',
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
/*
				'<div id="divComments" class="nameCat">Comments</div>',
				'<tpl if="functionComment != &quot;&quot;">',
				'<div id="divFuncionComment" class="infoJson">{functionComment}</div>',
				'</tpl>',
*/
				'<tpl if="tissue.length &gt; 0">',
				'<div class="nameCat">Tissues</div>',
					'<tpl for="tissue">',
						'<li class="infoList">{.}</li>',
					'</tpl>',
				'</tpl>',

				'<tpl if="subcellLocations.length &gt; 0">',
				'<div class="nameCat">Subcellular locations</div>',
					'<tpl for="subcellLocations">',
						'<li class="infoList">{.}</li>',
					'</tpl>',
				'</tpl>',

				'<tpl if="functionComment != &quot;&quot;">',
				'<div id="divFunction" class="nameCat">Function</div>',
				'<div class="infoJson">{functionComment}</div>',
				'</tpl>',


				'<tpl if="similarity.length &gt; 0">',
					'<div class="nameCat">Known similarities</div>',
					'<tpl for="similarity">',
						'<li class="infoList">{.}</li>',
					'</tpl>',
				'</tpl>',

				'<tpl if="goTerms.length &gt; 0">',
				'<div class="nameCat">GO terms</div>',
				'<tpl if="this.outGoTerms (\'mol\') == true">',
				'<div class="nameSubCat">Molecular functions</div>',
					'<tpl for="goTerms">',
						'<tpl if="type == \'Molecular function\'">',
							'<li class="goTermsList">[<a href="'+amigoURI+'{id}" target="_blank">{id}</a>] {value}</li>',
						'</tpl>',
					'</tpl>',
				'</tpl>',
				'</tpl>',

				'<tpl if="this.outGoTerms (\'bio\') == true">',
				'<div class="nameSubCat">Biological processes</div>',
					'<tpl for="goTerms">',
						'<tpl if="type == \'Biological process\'">',
							'<li class="goTermsList">[<a href="'+amigoURI+'{id}" target="_blank">{id}</a>] {value}</li>',
						'</tpl>',
					'</tpl>',
				'</tpl>',
				'</tpl>', {
					addListener: function(longSeq) {
						Ext.get('divSeq').on('mouseover', function(e) {
							e.stopEvent();
							console.info("click on seq...")
							
							Ext.create("Ext.tip.ToolTip", {
								target: 'divSeq',
								anchor: 'bottom',
								trackMouse: 'true',
								html: '<div class="sequence">'+longSeq+'</div>',
								width: 500
							})
						})
					}, // addListener
					createToolTip: function (longSeq) {
						Ext.create("Ext.tip.ToolTip", {
							target: 'divSeq',
							anchor: 'bottom',
							trackMouse: 'true',
							title: '<span style="font-size: 12px; font-weight: bold;">Target sequence</span>',
							html: '<div class="sequenceTip">'+longSeq+'</div>',
							maxWidth: 440,
							autoHide: false,
							closable: true
						})
					},
					outGoTerms: function (goTermCat) {
						if (goTermCat == 'bio')
							return bioProcesses > 0;

						if (goTermCat == 'mol')
							return molFunctions > 0;
					}
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

			var uniprotAcc = jsonObj.uniprot.entry.accession.length?
														jsonObj.uniprot.entry.accession[0]._text_:
														jsonObj.uniprot.entry.accession._text_

			entrezJson.accesion = uniprotAcc

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
				'<div id="divNames"class="citationTit">Publications from PubMed for <i>{accesion}</i></div>',
				'<div id="divCitations" style="overflow: scroll;height: '+(panelHeight-70)+'px">',
				'<tpl for=".">',
				'<a href="',
				'<tpl for="dbReference">',
				'<tpl if="_at_type == \'PubMed\'">http://www.ncbi.nlm.nih.gov/pubmed?term={_at_id}',
				'" target="_blank" style="text-decoration:none"></tpl>',
				'</tpl>', // dbReference
				'<div id="divCit{#}" class="{[xindex % 2 === 0 ? "citation-even" : "citation-odd"]}">',
				'<tpl for="authorList.person">{_at_name},</tpl><tpl if="this.hasAuthors(authorList.person)"><br/></tpl>',
				'<b>{title._text_}</b><br/>',
				'<i>{_at_name}</i> {_at_volume} ({_at_date})',
				'</div></a>',
				'</tpl>', // first for
				'</div>', {
					hasAuthors: function (authorList) {
						return (authorList.length > 0)
					},
					createToolTips: function (jsonObj) {
						Ext.each (jsonObj, function (cita, index, citations) {
							var htmlStr = "Click to access the article '<i>"+cita.title._text_+"</i>'"
							var pubmed = JSONSelect.match('.dbReference :has(._at_type:val(\"PubMed\"))', cita)
							Ext.create("Ext.tip.ToolTip", {
								target: 'divCit'+(index+1), // pubmed[0]._at_id,
								anchor: 'bottom',
								trackMouse: 'true',
				//				title: '<span style="font-size: 12px; font-weight: bold;">Target sequence</span>',
								html: '<div style="font-size: 12px; font-family: Arial">'+htmlStr+'</div>',
								maxWidth: 440
							})
						})
					}
				} // EO functions
			)

			return xTpl
		},



/**
 * Creates a template to display pathway information.
 * @return the template
 */
		createPathwayInfoTpl: function (h, w) {
			var divStr = '<div id="divPathway" ' // style="overflow-y: scroll; '
			divStr += w != undefined? 'width: '+w+'px; ': ''
//			divStr += h != undefined? 'height:'+h+'px; ': ''
			divStr += '">'

			var pathwayTpl = new Ext.XTemplate (
//		'<tpl if="this.isData(name) && this.isData(description)">',
				divStr,
				'<p class="citationTit">Kegg id: {keggid}</p>',
				'<p style="margin-bottom: 10px; padding-right: 5px"><b>Name</b>: {name}</p>',
				'<p style="margin-bottom: 20px; padding-right: 5px"><b>Description</b>: {description}</p>',
				'<p><a href="{url-img-big}" target="_blank" style="text-decoration: none">',
					'<img src="{url-img-small}" alt="{name}"/>',
				'</a></p>',
				'</div>',
				 {
					isData: function (jsonAttr) {
						return jsonAttr != undefined
					}
				}
			)
			return pathwayTpl
		},


		createIntAnnotationTpl: function () {

			var interactionTpl = new Ext.XTemplate (
				'<div style="height: auto;">',
				'<div class="citationTit">Interaction network for <i>{uniprotAcc}</i></div> ',
				'<img src="{imgUri}"/><br/>',
				'<div class="citation-even"><b>Annotaion:</b> {annotation}</div>',
				'</div>'
			)

			return interactionTpl
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