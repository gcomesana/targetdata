// Ext.require (["TD.controller.util.TargetInfoUtil"])

Ext.define ("TD.controller.TargetInfo", {
	views: ["form.FormSearch", "tab.TargetInfoPanel"],

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


//	uniprotJson: {},

	targetInfoUtil: null,

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
			}
		})
	},




	onPanelShow: function (theComp, opts) {
		var compId = theComp.getId()
		var height = theComp.getHeight()
		if (compId == 'targetcitations') {
			var infoTpl = TD.controller.util.XTplFactory.createCitationXTpl(height)
			var citsJson = TD.controller.util.XTplFactory.citationInfo()

			var panelInfo = Ext.widget ("targetinfo", {
				tpl: infoTpl,
				tplObj: citsJson,
				collapsible: false,
				frame: false,
				frameHeader: false,
				title: "",
				preventHeader: true,
				border: 0
			})
			theComp.add(panelInfo)
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
		Ext.getBody().mask("Sending request...")

		var theForm = btn.findParentByType("form")
		var txtRequest = theForm.child("textfield")
		var txtValue = txtRequest.getValue()
	//	txtValue = theForm.child ("combo").getValue()
	
		var self = this
//		self.targetInfoUtil = Ext.create ("TD.controller.util.TargetInfo", {})
		TD.controller.util.TargetInfoUtil.uniprotReq (txtValue)
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



/**
 * Get the main target information from the uniprot json object via an ajax call
 *
 * @param id, the uniprot id to retrieve the target
 *
	uniprotReq: function (id) {
		var self = this
		var uniprotId = id

// piece of snippet to get the correct url
		var host = window.location.hostname
		var isLocalhost = function(elem, index, array) { return elem == host }
		var uris = this.hostLocal.some (isLocalhost)?	this.urisLocal:	this.urisProd
		var uri = uris.filter(function (elem, index, array) {
			return elem.cat == "uniprot"
		})
// console.info(uri[0].cat+":"+uri[0].url)

		Ext.Ajax.request({
//			url: "http://ws.bioinfo.cnio.es/OpenPHACTS/cgi-bin/uniFetcher.pl",
//			url: "/cgi-bin/uniFetcher.pl",
			url: uri[0].url,
			params: {
				id: uniprotId
			},
			method: "GET",


			success: function (response, opts) {
				var tpl

// Get the main info from uniprot
//				var view = Ext.ComponentQuery.query ('viewport > panel > targetinfo > panel[id="uniprotInfo"]')
				var view = Ext.ComponentQuery.query ('viewport > panel > targetinfo')
				if (response.responseText.length == 0) {
					tpl = self.createEmptyTpl(opts.params.id)
					tpl.overwrite(view[0].body, {})
				}
				else {
					var jsonResp = response.responseText.replace ("$", "dollar_", "g").replace("@","at_", "g")
					var jsonObj = Ext.JSON.decode (jsonResp)
					self.uniprotJson = jsonObj
					var myJsonObj = self.translateJson (jsonObj)
					myJsonObj.uniprotId = opts.params.id
					self.uniprotJson = myJsonObj
					try {
						tpl = self.createInfoXTpl ()
					}
					catch (e) {
						console.error (e.name)
						console.error (e.message)
					}
					tpl.overwrite(view[0].body, myJsonObj)
				}

				Ext.getBody().unmask()
				var contentTabs = Ext.ComponentQuery.query ('viewport > tabpanel[itemId="contentTabPanel"]')
				contentTabs[0].setActiveTab(0)
				var infopanels = Ext.ComponentQuery.query ('viewport > tabpanel > targetinfo > panel')
				Ext.Array.each (infopanels, function (item, index, panelsItself) {
					item.setVisible(true)
				})
			},


			failure: function (response, opts) {
				console.error ("Error in ajax call")
				console.error (response)
			}
		}) // EO Ajax.request
	},


	
**
 * Custom method to convert the uniprot json into a json object with the
 * right elements to represent as a target information
 * @param myJson, the json object already converted from the text received
 * from uniprot cgi script as text
 *
	translateJson: function (myJson) {
//		var jsonObj = Ext.JSON.decode (myJson)
		var jsonObj = myJson
		var newJsonStr = "{"

		var fullName =
			JSONSelect.match (".uniprot .entry .protein .recommendedName .fullName ._text_", jsonObj)
		if (fullName.length > 0) {
			newJsonStr += '"fullName": "'+fullName[0]+'",'
		}
		else
			newJsonStr += '"fullName": "",'

		var shortName =
			JSONSelect.match (".uniprot .entry .protein .recommendedName .shortName ._text_", jsonObj)
		if (shortName.length > 0) {
			newJsonStr += '"shortName": "'+shortName[0]+'",'
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
		var commentFunc = comment.length > 0? comment[0].text._text_: ''
		newJsonStr += '"functionComment": "'+commentFunc+'",'

		var organism
		organism = JSONSelect.match('.uniprot .entry .organism .name :has(._at_type:val("common"))', jsonObj)
		var organismCommon = organism.length > 0? organism[0]._text_: ''
		newJsonStr += '"organismName": "'+organismCommon+'",'

		newJsonStr += "}"
// OJO!!!!!!! Shouldn't be necessary (or yes...) but XTemplate don't support $ and @
		newJsonStr = newJsonStr.replace("$","", "g")
		newJsonStr = newJsonStr.replace("@", "", "g")

		var newJsonObj = Ext.JSON.decode (newJsonStr)

		return newJsonObj
	},


	**
	 * Creates a XTemplate for a empty response of a uniprot request.
	 * @param reqId, the requested id which does not have any uniprot entry
	 *
	createEmptyTpl: function (reqId) {
		var tpl = new Ext.XTemplate (
			'<div class="uniprotId" id="divTit">Uniprot Id '+reqId+'</div>',
			'<div class="infoJson">There is no result for the requested Uniprot id ('+reqId+').</div>'
		)

		return tpl
	},


	**
	 * Creates a XTemplate to display the result of a successful uniprot request
 	 *
	createInfoXTpl: function () {
		var tpl = new Ext.XTemplate (
			'<div class="uniprotId" id="divTit">Uniprot Id {uniprotId}</div>',
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
	}
 */
})