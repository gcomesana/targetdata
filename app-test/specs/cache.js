
// Ext.require (["TD.model.CacheReqParam", "TD.model.CacheReq"])
describe ("Cache feats", function () {
	var cacheSt = null
	var paramRecord = null
	var reqRecord = null


	beforeEach (function () {
		if (!cacheSt) {
			cacheSt = Ext.create ("TD.store.CacheReqs")

			expect (cacheSt).toBeTruthy()
			cacheSt.load()
			waitsFor (
				function () { return !cacheSt.isLoading() },
				"Cache never loaded: PROBLEM!!!",
				4000
			)
		}
	})


	it ("0. Remove all items and then empty store", function () {
		cacheSt.loadData([], false)

		expect (cacheSt.getCount()).toEqual(0)
	})


	it ("1. Initial size should be 0", function () {
		expect (cacheSt.getCount()).not.toBeLessThan(0)
	})


	
	it ("2. CacheReqParam object created", function () {
		var param = {name: 'protein', value: 'cdk5' }

		var paramType = Ext.ModelManager.getModel('TD.model.CacheReqParam')
		expect (paramType).toBeTruthy()
		
//		var paramRecord = new TD.model.CacheReqParam (param)
//		var paramRecord = Ext.ModelManager.create(param, 'TD.model.CacheReqParam')
		paramRecord = new TD.model.CacheReqParam ({name:"protein", value:"cdk5"})
		expect (paramRecord).toBeTruthy()
		expect (paramRecord).not.toBeUndefined()
		expect (paramRecord.get('name')).not.toBeNull()

		expect (paramRecord.get('value')).toEqual('cdk5')
	})


	it ("3. CacheReq object created", function () {
		var req = {url: 'lady-qu', jsonresp: "{'source':'uniprot', 'genes':['ack','dbi','brca1']}"}
		reqRecord = new TD.model.CacheReq (req)

		expect (reqRecord).toBeDefined()
		expect (reqRecord).not.toBeNull()

		expect (reqRecord.get('url')).toEqual('lady-qu')
	})



	it ("4. Request-Params association", function () {
		expect (reqRecord).toBeDefined()
		expect (paramRecord).toBeDefined()
		
		expect (reqRecord.params()).toBeDefined()
		expect (reqRecord.params().getCount()).toEqual(0)

		var params = reqRecord.params()
		params.add ({name: 'protein', value: 'cdk5' })

//		params.sync() // nop as there is not store associated up until here...

	})

	

	it ("5. Cache requests store should hold a request", function () {
		expect (cacheSt).toBeDefined()

// Fresh store content to get the specs homogeneous from here on
		if (cacheSt.getCount() > 0)
			cacheSt.loadData([], false)

// mocking the elements
		var urlOne = '/cgi-bin/uniprotFetcher.pl'
		var paramOne = {name:'id', value:'Q13362'}, paramTwo = {name:'id', value: 'P12345'}
		var jsonRespOne = '{"uniprot":{"entry":{"keyword":[{"_text_":"3D-structure","_at_id":"KW-0002"},{"_text_":"Alternative splicing","_at_id":"KW-0025"},{"_text_":"Centromere","_at_id":"KW-0137"},{"_text_":"Chromosome","_at_id":"KW-0158"},{"_text_":"Complete proteome","_at_id":"KW-0181"},{"_text_":"Nucleus","_at_id":"KW-0539"},{"_text_":"Phosphoprotein","_at_id":"KW-0597"},{"_text_":"Polymorphism","_at_id":"KW-0621"},{"_text_":"Reference proteome","_at_id":"KW-1185"}]}}}',
				jsonRespTwo = '{"uniprot":{"entry":{"keyword":[{"_text_":"3D-structure","_at_id":"KW-0202"},{"_text_":"Natural splicing","_at_id":"KW-4025"},{"_text_":"Centromere","_at_id":"KW-4137"},{"_text_":"Chromosome","_at_id":"KW-1158"},{"_text_":"Proteome","_at_id":"KW-6969"},{"_text_":"Core","_at_id":"KW-0539"},{"_text_":"Phospho-protein","_at_id":"KW-0550"},{"_text_":"Polymorphic","_at_id":"KW-0621"},{"_text_":"Reference proteome","_at_id":"KW-1185"}]}}}'

// mimicing the behaviour afterrequest (either success or not...)
		var reqOne = new TD.model.CacheReq ({id: 1, url: urlOne, jsonresp: jsonRespOne})
		var reqTwo = new TD.model.CacheReq ({id: 2, url: urlOne, jsonresp: jsonRespTwo})
		var objParamOne = new TD.model.CacheReqParam (paramOne),
			objParamTwo = new TD.model.CacheReqParam (paramTwo)

		expect (reqOne.params).toBeDefined()
		reqOne.params().add(paramOne)
		cacheSt.add(reqOne)

		reqTwo.params().add(paramTwo)
		cacheSt.add(reqTwo)
		cacheSt.sync()
// console.log ("store size: "+cacheSt.getCount()+" items")
		expect (cacheSt.getCount()).toEqual(2)
	})




	it ("6. Retrieve amount of cache items", function() {
		expect (cacheSt).toBeTruthy()

		var numReqs = cacheSt.getCount()
		expect (numReqs).toBeGreaterThan(1)
	})



	it ("7. Retrieve items from cache store", function () {
		expect (cacheSt).toBeTruthy()

		var firstOne = cacheSt.first()
		var paramsOne = firstOne.params() // paramsOne is Store
		var firstParam = paramsOne.first() // A model, first record

		expect (paramsOne).toBeDefined()
		
		expect (cacheSt.getCount()).toEqual(2)
	})


	it ("7-bis. Filtering by url & param values", function () {
		expect (cacheSt).toBeDefined()

		var filterUrl = "/cgi-bin/uniprotFetcher.pl"
		var filterParamVal = "P12345", filterParamName = "id"
		cacheSt.filter ('url', filterUrl)

		cacheSt.each(function (record) {
			var params = record.params()

			params.filter('name', filterParamName)
			params.filter('value', filterParamVal)

// if found, return the jsonResp... record.getAt(0).get('jsonResp')
			if (params.getCount() == 1)
				expect(record.get('jsonresp')).not.toBeNull()
		})

	})


	it ("8. Remove cache items", function () {
		expect (cacheSt).toBeTruthy()

//		cacheSt.getProxy().clear()
		cacheSt.loadData([], false)
		cacheSt.sync()
		expect (cacheSt.getCount()).toEqual(0)
		
	})

})