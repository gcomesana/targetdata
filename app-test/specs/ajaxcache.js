
describe ("Scenarios and specs for CustomAjax", function () {

	describe ("CustomAjax with empty cache", function () {

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
			var opts = {url: "/cgi-bin/uniFetcher.pl", params: {id:"Q13131",hash:"0937840698"}}
			var jsonResp = '{code:"uniprot",id:"987",references:["one", "two", "three"]}'

			expect (TD.util.CustomAjax.requestCache).toBeDefined()

			TD.util.CustomAjax.addToCache(opts, jsonResp)
		})
	}) // describe

	

})