
Ext.define ("TD.controller.UniprotReq", {
	extend: "Ext.app.Controller",

	views: ["form.FormSearch", "panel.tab.TargetFunctionPanel"],

	init: function () {
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
			} // EO txtIdSearch
		})
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

		var self = this
		self.uniprotReq (txtValue)
	},



	uniprotReq: function (id) {
		var self = this
		var uniprotId = id

		Ext.Ajax.request({
//			url: "resources/data/p23486.json",
// TODO aquí estaba
			url: "http://ws.bioinfo.cnio.es/OpenPHACTS/cgi-bin/uniFetcher.pl",
			params: {
				id: uniprotId
			},
			method: "GET",
			
			success: function (response, opts) {
				var tpl
				var view = Ext.ComponentQuery.query ("viewport > panel > targetfunction")

				if (response.responseText.length == 0) {
					tpl = self.createEmptyTpl(opts.params.id)
					tpl.overwrite(view[0].body, {})

				}
				else {
					var jsonResp = response.responseText.replace ("$", "dollar_", "g").replace("@","at_", "g")
					var myJsonObj = self.translateJson (jsonResp)
					myJsonObj.uniprotId = opts.params.id
//					console.info ("object to use: " + Ext.JSON.encode (myJsonObj))
					try {
						tpl = self.createXTemplate ()
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
			},

			failure: function (response, opts) {
				console.error ("Error in ajax call")
				console.error (response)
			}
		})
	},


	
/**
 * Custom method to convert the uniprot json into a json object with the
 * right elements to represent as a target information
 * @param myJson, the json text as received from uniprot gateway
 */
	translateJson: function (myJson) {
		var jsonObj = Ext.JSON.decode (myJson)
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


	/**
	 * Creates a XTemplate for a empty response of a uniprot request.
	 * @param reqId, the requested id which does not have any uniprot entry
	 */
	createEmptyTpl: function (reqId) {
		var tpl = new Ext.XTemplate (
			'<div class="uniprotId" id="divTit">Uniprot Id '+reqId+'</div>',
			'<div class="infoJson">There is no result for the requested Uniprot id ('+reqId+').</div>'
		)

		return tpl
	},


	/**
	 * Creates a XTemplate to display the result of a successful uniprot request
 	 */
	createXTemplate: function () {
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
})