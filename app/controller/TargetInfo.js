Ext.require (["TD.controller.util.TargetInfoUtil"])

Ext.define ("TD.controller.TargetInfo", {
	views: ["form.FormSearch", "tab.TargetInfoPanel", "KeggPathwaysGrid"],
	stores: ["KeggPathways", "ProteinLookup"],
	models: ["KeggPathway", "ProteinLookup"],
	
	extend: "Ext.app.Controller",
	requires: ['TD.controller.util.TargetInfoUtil', 'TD.controller.util.XTplFactory'],

// TODO HABRÍA QUE HACER UN STORE CON TODO ESTO PARA QUE ESTEN GUARDADITAS
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


	currentUniprot: '',

	endpoint: 'localhost',
	cgiPath: '/cgi-bin/cgiruby.rb',
	PROTEIN_LOOKUP :1,
  PROTEIN_INFO: 2,
  GET_PATHWAYS: 3,
  PATHWAY_INFO: 4,
  GET_INTERACTION: 5,
  CHECK_ENDPOINT: 6,

	targetInfoUtil: null,
	stringBaseUri: null,





/**
 * Initialization method for the controller
 */
	init: function () {
		targetInfoUtil = TD.controller.util.TargetInfoUtil

		this.control({
			"#btnSearch": {
				// render: this.onRenderBtnSearch,
				click: this.onClickBtnSearch
			},

			"#txtIdSearch": {
				specialkey: function(field, e) {
					if (e.getKey() == e.ENTER) {
//						field.up('form').getForm().submit();
						var btn = field.up("form").down("#btnSearch")
						this.onClickBtnSearch (btn)
					}
				}
			}, // EO txtIdSearch

			"viewport > panel > targetinfo panel": {
				expand: this.onPanelExpand
			},

			'viewport center-tabs panel': {
				activate: this.onPanelShow
			},

			'#pathways-grid': {
//				selectionchange: this.onPathwaySelect,
				itemclick: this.onPathwayClick
			},

			'viewport > tab-west-panel > panel > formsearch > examples-combo': {
				select: this.onSelectExample
			},

			'viewport > tab-west-panel > panel > formsearch > combo-protein-lookup': {
				beforerender: this.onProteinLookupRender
			}
		}) // EO this.control
	},

	

	onProteinLookupRender: function (comp, opts) {
		var store = this.getStore('TD.store.ProteinLookup')
		var me = this

		if (store) {
			console.info ("Store accessed...")
			comp.store.getProxy().url = me.cgiPath
			comp.store.getProxy().extraParams = {
				what: me.PROTEIN_LOOKUP,
				endpoint: me.endpoint
			}
		}
	},


	setEndpoint: function (endpoint) {
		this.endpoint = endpoint
	},


	onSelectExample: function (field, value, opts) {
		console.info ("got it viewport > tab-west-panel > panel...")
		var panels = Ext.ComponentQuery.query ('viewport > center-tabs panel')
		Ext.each (panels, function (panel, index, panelsItself) {
			panel.removeAll()
		})
		targetInfoUtil.uniprotReq(Ext.htmlEncode(field.getValue()))
	},



	onPathwayClick: function (grid, record, item, index, ev, opts) {
		var thePanel = Ext.getCmp("panel4PathwayInfo")
		var me = this

		thePanel.pathTpl.overwrite(thePanel.body, {})
		TD.util.CustomAjax.bodyMasking = true
		TD.util.CustomAjax.maskMsg = 'Sending request for pathways...'

//		Ext.Ajax.request({
		TD.util.CustomAjax.request ({
//			url: '/cgi-bin/pathway_info.rb',
			url: me.cgiPath,
			params: {
				pathway: record.raw[0],
				ep: me.endpoint,
				what: me.PATHWAY_INFO
			},

			success: function(response){
				var jsonResp = response.responseText;
				var jsonObj = Ext.JSON.decode (jsonResp)
				var imgSmallName = record.raw[0].substr(3)
				jsonObj['url-img-small'] = 'http://www.genome.jp/kegg/misc/thumbnail/map'+imgSmallName+'.gif'
				jsonObj['url-img-big'] = 'http://www.genome.jp/kegg/pathway/hsa/'+record.raw[0]+'.png'
				jsonObj['keggid'] = record.raw[0]
				
				thePanel.pathJson = jsonObj
				thePanel.pathTpl.overwrite(thePanel.body, thePanel.pathJson)
			},

			failure: function (response, opts) {
				console.error ("Error in ajax call")
				console.error (response)
			}
		}); // EO Ajax req

	},



/**
 * Response method every time a tab is clicked (and then, the panel showed)
 * @param theComp
 * @param opts
 */
	onPanelShow: function (theComp, opts) {
		var compId = theComp.getId()
		var height = theComp.getHeight()
		var uniprotJson = TD.controller.util.TargetInfoUtil.uniprotJson
		var me = this

		if (compId == 'targetcitations') {
			var infoTpl = TD.controller.util.XTplFactory.createCitationXTpl(height)
			var msgEmpty = "No citations found for the Uniprot Id: ????"
			var emptyTpl = TD.controller.util.XTplFactory.createEmptyTpl(msgEmpty, uniprotJson.uniprotId)
			var citsJson = TD.controller.util.XTplFactory.citationInfo()

			theComp.removeAll()
			var panelInfo = Ext.widget ("targetinfo", {
				tpl: infoTpl,
				emptyTpl: emptyTpl,
				tplObj: citsJson,
				emptyObjThreshold: 1,
				numItems: citsJson.length,
				collapsible: false,
				frame: false,
				frameHeader: false,
				title: "",
				preventHeader: true,
				border: 0
			})

			theComp.add(panelInfo)
			panelInfo.tpl.createToolTips(citsJson)
		}

////////////////////////////////////////////////////////////////////////////
		if (compId == 'targetpathways') {
//			var gene = JSONSelect.match(".gene .name :has(._at_type:val(\"primary\"))", uniprotJson)
			var gene = uniprotJson.uniprotId

			theComp.removeAll()
//			var pathwayStore = Ext.data.StoreManager.lookup('keggpathways-store')
			var pathwayStore = Ext.create ("TD.store.KeggPathways")
			pathwayStore.proxy.url = me.cgiPath;
			pathwayStore.proxy.extraParams = {
//				protein: Ext.getCmp('formSearch').currentUniprotId
				protein: gene,
				what: me.GET_PATHWAYS,
				endpoint: me.endpoint
			}
			var gridPathways = Ext.create("TD.view.KeggPathwaysGrid", {
				flex: 1,
				title: "Pathways from KEGG",
				store: pathwayStore,
				id: "pathways-grid"
			})

			var panelPathW = theComp.getWidth()*0.75-50
			var panelPath = Ext.create("Ext.panel.Panel", {
				border: false,
				frame: false,
//				height: 800,
				minWidth: panelPathW,
				autoScroll: true,
				id: "panel4PathwayInfo",

				pathJson: null,
				pathTpl: TD.controller.util.XTplFactory.createPathwayInfoTpl(400, panelPathW),
				flex: 3,
				margins: '0 0 0 10'
			})

			pathwayStore.load(function (records, op, success) {
				if (pathwayStore.getCount() == 0) {
					var emptyCfg = {
						html: '<span class="citationTit">No pathways found for <i>'+gene+'</i> protein</span>',
						bodyStyle: 'border-width: 0px; padding-top: 10px',
						style: {
							borderWidth: '0px'
						}
					}
					panelPath.add (Ext.apply(emptyCfg))
				}
			})

			var newConfig = {
				layout: {
					type: 'hbox',
//					padding:'5'
					align: 'stretch'
				},
				minHeight: 75,
				defaults:{
					margins:'0 15 0 0',
					height: 300
				},
				items: [
					gridPathways
					,
					panelPath
				]
			}
			theComp.add(Ext.apply (newConfig))
			Ext.getCmp('panel4PathwayInfo').body.setStyle('border', '1px dotted black')
		} // EO targetpathways


////////////////////////////////////////////////////////////////////////////
		if (compId == "targetInteractions") {
			theComp.removeAll()
			
			stringBaseUri = "http://string-db.org/api/image/network?identifier=xxxx&required_score=950&limit=10&network_flavor=evidence";
			var msgEmpty = "No interactions found for the Uniprot Id ????"
			var intPanel = Ext.create ("TD.view.tab.TargetInfoPanel", {
//								tpl: self.createInfoXTpl(),
				tpl: TD.controller.util.XTplFactory.createIntAnnotationTpl(),
				emptyTpl: TD.controller.util.XTplFactory.createEmptyTpl (msgEmpty, uniprotJson.uniprotId),
				tplObj: {},
				emptyObjThreshold: 0,
				numItems: 1,
				collapsed: false,
				frameHeader: false,
				collapsible: false,
				id: "panel4Interactions",
				maxWidth: 580,
				minWidth: 400,
				width: 580,

//				maxHeight: 700,
				height: 700,
//				minHeight: 500,
				title: "Interactions from STRING db",
				
				listeners: {
					'render': function (comp, opts) {
//						var me = this
						var thePanel = comp
						var uniprotAcc = uniprotJson.uniprot.entry.accession.length?
														uniprotJson.uniprot.entry.accession[0]._text_:
														uniprotJson.uniprot.entry.accession._text_

//						thePanel.tpl.overwrite(thePanel.body, {})
						TD.util.CustomAjax.bodyMasking = true
						TD.util.CustomAjax.maskMsg = 'Sending request to StringDB...'
//						Ext.Ajax.request({
						TD.util.CustomAjax.request ({
//							url: '/cgi-bin/string_resolve.rb',
							url: me.cgiPath,
							params: {
								uniprotAcc: uniprotAcc,
								what: me.GET_INTERACTION,
								endpoint: me.endpoint
							},

							success: function(response){
								var jsonResp = response.responseText;
								var jsonObj = Ext.JSON.decode (jsonResp)
								thePanel.tplObj = jsonObj[0]

								stringBaseUri = stringBaseUri.replace ("xxxx", thePanel.tplObj.stringId)
								thePanel.tplObj.imgUri = stringBaseUri
								thePanel.tplObj.uniprotAcc = uniprotAcc

								thePanel.numItems = thePanel.jsonObj == undefined? 0: 1
								if (thePanel.numItems >= thePanel.emptyObjThreshold)
									thePanel.tpl.overwrite(thePanel.body, thePanel.tplObj)
								else
									thePanel.emptyTpl.overwrite(thePanel.body, thePanel.tplObj)

//								thePanel.tpl.overwrite(thePanel.body, thePanel.tplObj)
							},

							failure: function (response, opts) {
								console.error ("Error in ajax call")
								console.error (response)
							}
						}); // EO Ajax req
					} // EO render
				} // EO listeners
			})
			theComp.add (intPanel)
		}
	},


/**
 * Controller method when the button search is clicked. This method:
 * - creates the XTemplate
 * - assign the data retrieved to the XTemplate
 * - add the XTemplate to the TargetFunctionPanel
 * @param btn
 * @param ev
 * @param opts
 */
	onClickBtnSearch: function (btn, ev, opts) {
// Check cache for proteinId existence
// Otherwise, do ajax request call
		var theForm = btn.findParentByType("form")
		var txtRequest = theForm.child("textfield")
		var txtValue = txtRequest.getValue()
		var formSearch = Ext.getCmp('formSearch')
		formSearch.currentUniprotId = txtValue

		Ext.getCmp('infoPanel').removeAll()
//		TD.controller.util.TargetInfoUtil.uniprotReq (Ext.htmlEncode(txtValue))
		targetInfoUtil.uniprotReq (Ext.htmlEncode(txtValue))
	},



/**
 * Method response to expand event on any of the addtional information panels.
 * @param panel, the panel which triggers the event
 * @param evOpts, the object event options
 */
	onPanelExpand: function (panel, evOpts) {
		var targetInfoCls = TD.controller.util.TargetInfoUtil
		if (panel.getId() == "citationInfo") {
			var citObj = JSONSelect.match(".uniprot .entry .reference .citation", targetInfoCls.uniprotJson)
			console.info ("citObj: "+citObj)

		}
		else if (panel.getId() == "dbRefInfo") {
			var dbRefObj = JSONSelect.match(".uniprot .entry .reference .citation", targetInfoCls.uniprotJson)
			console.info ("dbRefObj: "+dbRefObj)
		}
	},

	test: function () {
		return 'TD.controller.TargetInfo.test() => OK';
	}


})