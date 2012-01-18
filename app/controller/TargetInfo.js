// Ext.require (["TD.controller.util.TargetInfoUtil"])

Ext.define ("TD.controller.TargetInfo", {
	views: ["form.FormSearch", "tab.TargetInfoPanel", "KeggPathwaysGrid"],
	stores: ["KeggPathways"],
	models: ["KeggPathway"],
	
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
		{"cat":"uniprot", "url":"cgi-bin/uniFetcher.pl"},
		{"cat":"pubmedAbstrac", "url": "cgi-bin/togoAbstractFetch.pl"}
	],



	currentUniprot: '',

	targetInfoUtil: null,
	stringBaseUri: null,

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
			}
		})
	},



	onPathwaySelect: function (selModel, selections, opts) {
console.info ("onPathwaySelect -> selection length: "+selModel.getSelection().length+" vs "+selections.length)


	},



	onPathwayClick: function (grid, record, item, index, ev, opts) {
// console.info ("onPathwayClick -> gridId: "+grid.getId()+" on index: "+index)
		var thePanel = Ext.getCmp("panel4PathwayInfo")

		thePanel.pathTpl.overwrite(thePanel.body, {})
		TD.util.CustomAjax.bodyMasking = true
		TD.util.CustomAjax.maskMsg = 'Sending request for pathways...'
//		Ext.Ajax.request({
		TD.util.CustomAjax.request ({
			url: '/cgi-bin/pathway_info.rb',
			params: {
				pathway: record.raw[0]
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
//						comp.add (pathwayTpl)
					// process server response here
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

		if (compId == 'targetcitations') {
			var infoTpl = TD.controller.util.XTplFactory.createCitationXTpl(height)
			var msgEmpty = "No citations found for Uniprot Id: ????"
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
			var gene = JSONSelect.match(".gene .name :has(._at_type:val(\"primary\"))", uniprotJson)

			theComp.removeAll()
//			var pathwayStore = Ext.data.StoreManager.lookup('keggpathways-store')
			var pathwayStore = Ext.create ("TD.store.KeggPathways")
			pathwayStore.proxy.extraParams = {
//				protein: Ext.getCmp('formSearch').currentUniprotId
				protein: gene[0]._text_
			}
			pathwayStore.load()
			var gridPathways = Ext.create("TD.view.KeggPathwaysGrid", {
				flex: 1,
				title: "Pathways from KEGG",
				store: pathwayStore,
				id: "pathways-grid"
			})

			var panelPathW = theComp.getWidth()*0.75-50
			var panelPath = Ext.create("Ext.panel.Panel", {
				border: 0,
				frame: false,
				minHeight: 800,
				height: 800,
				minWidth: panelPathW,
//				width: "500",
				id: "panel4PathwayInfo",
				html: '<div class="citationTit">KEGG description</div>',

				pathJson: null,
				pathTpl: TD.controller.util.XTplFactory.createPathwayInfoTpl(400, panelPathW),

				flex: 3,
				margins: '0 0 0 10'
			})

			var newConfig = {
				layout: {
						type: 'hbox',
						padding:'5'
				},
				minHeight: 75,
				defaults:{margins:'0 15 0 0'},
				items: [
					gridPathways
					,
					panelPath
				]
			}
			theComp.add(Ext.apply (newConfig))
		}


////////////////////////////////////////////////////////////////////////////
		if (compId == "targetInteractions") {
			theComp.removeAll()
			stringBaseUri = "http://string-db.org/api/image/network?identifier=xxxx&required_score=950&limit=10&network_flavor=evidence";

			var intPanel = Ext.create ("TD.view.tab.TargetInfoPanel", {
//								tpl: self.createInfoXTpl(),
				tpl: TD.controller.util.XTplFactory.createIntAnnotationTpl(),
				tplObj: {},
				collapsed: false,
				frameHeader: false,
				collapsible: false,
				id: "panel4Interactions",
				maxWidth: 550,
				minWidth: 400,
				width: 550,

//				maxHeight: 700,
				height: 700,
//				minHeight: 500,
				title: "Interactions from STRING db",
				
				listeners: {
					'render': function (comp, opts) {
						var thePanel = comp
						var uniprotAcc = uniprotJson.uniprot.entry.accession.length?
														uniprotJson.uniprot.entry.accession[0]._text_:
														uniprotJson.uniprot.entry.accession._text_

//						thePanel.tpl.overwrite(thePanel.body, {})
						TD.util.CustomAjax.bodyMasking = true
						TD.util.CustomAjax.maskMsg = 'Sending request to StringDB...'
//						Ext.Ajax.request({
						TD.util.CustomAjax.request ({
//							async: false,
							url: '/cgi-bin/string_resolve.rb',
							params: {
								uniprotAcc: uniprotAcc
							},

							success: function(response){
								var jsonResp = response.responseText;
								var jsonObj = Ext.JSON.decode (jsonResp)
								thePanel.jsonObj = jsonObj[0]

								stringBaseUri = stringBaseUri.replace ("xxxx", thePanel.jsonObj.stringId)
								thePanel.jsonObj.imgUri = stringBaseUri
								thePanel.jsonObj.uniprotAcc = uniprotAcc

								thePanel.tpl.overwrite(thePanel.body, thePanel.jsonObj)
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
//		Ext.getBody().mask("Sending request...")

		var theForm = btn.findParentByType("form")
		var txtRequest = theForm.child("textfield")
		var txtValue = txtRequest.getValue()
		var formSearch = Ext.getCmp('formSearch')
		formSearch.currentUniprotId = txtValue
	//	txtValue = theForm.child ("combo").getValue()

		Ext.getCmp('infoPanel').removeAll()
//		self.targetInfoUtil = Ext.create ("TD.controller.util.TargetInfo", {})
		TD.controller.util.TargetInfoUtil.uniprotReq (Ext.htmlEncode(txtValue))
//		self.uniprotReq (txtValue)
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
	}




})