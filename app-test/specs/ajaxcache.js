
describe ("Scenarios and specs for CustomAjax", function () {

	describe ("CustomAjax with empty cache and add", function () {

		beforeEach (function () {
//			spyOn (TD.util.CustomAjax, 'cacheInit') // cacheInit is mocked
			TD.util.CustomAjax.init ({clearCache: true})
		})

		it ("should be empty cache", function () {
			expect (TD.util.CustomAjax.requestCache).toBeTruthy()
			expect (TD.util.CustomAjax.requestCache.getCount()).toEqual(0)
//			expect (TD.util.CustomAjax.requestCache.getCount()).toEqual(1)
		})



		it ("should add a new item to cache", function () {
			var optsOne = {url: "/cgi-bin/uniFetcher.pl", params: {id:"Q13131",hash:"0937840698"}},
					optsTwo = {url: "/cgi-bin/uniFetcher.pl", params: {id:"P12345",hash:"ABCDE"}};
			var jsonRespOne = '{code:"uniprot",id:"987",references:["one", "two", "three"]}',
					jsonRespTwo = '{code:"uniprot",id:"555",references:["five", "siX", "seven"]}'


			expect (TD.util.CustomAjax.requestCache).toBeDefined()

			var itemCountIni = TD.util.CustomAjax.requestCache.getCount()
			TD.util.CustomAjax.addToCache(optsOne, jsonRespOne)
			TD.util.CustomAjax.addToCache(optsTwo, jsonRespTwo)
			var itemCountEnd = TD.util.CustomAjax.requestCache.getCount()

			expect (itemCountIni).toBeLessThan(itemCountEnd)
			expect (itemCountEnd-itemCountIni).toEqual(2)

		})
	})


	describe ('Custom ajax as is and fetch', function() {
		it ("shold retrieve the previously retrieved item", function () {
			var theUrl = "/cgi-bin/uniFetcher.pl"
			var params = {id:"Q13131", hash:"0937840698"}

			var jsonResp = TD.util.CustomAjax.fetchRequest(theUrl, params)
			expect(jsonResp).not.toBeNull()

			var jsonObj = Ext.JSON.decode (jsonResp)
			expect(jsonObj).not.toBeNull()
			expect(jsonObj.id).toEqual('987')
		})


		it ("should retrieve nothing", function () {
			var theUrl = "www.google.com"
			var params = {id:"a",query:"b"}

			var jsonResp = TD.util.CustomAjax.fetchRequest(theUrl, params)
			expect(jsonResp).toBeNull()
		})
		
	}) // describe


	describe ('Mimicing a real asynchronous request', function () {

		it ('should add a new item to cache', function () {
			var countBefore = TD.util.CustomAjax.requestCache.getCount()
			TD.util.CustomAjax.request({
				url: '/cgi-bin/uniFetcher.pl',
				params: {
					id: 'P30838'
				},
				method: 'GET'
			})

			waitsFor (
				function () {
					return TD.util.CustomAjax.isLoading()
				}, 'Not loaded', 1500
			)

			var countAfter = TD.util.CustomAjax.getCount()

			expect(countAfter-countBefore).toBeGreaterThan(0)
			expect (countAfter).toBeGreaterThan(countBefore)
		})

	})
})