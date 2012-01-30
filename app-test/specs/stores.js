
describe ("Stores tests", function () {

	var ctrl = null

	beforeEach (function () {
		if (!ctrl)
			ctrl = Application.getController("TargetInfo")

		expect (ctrl).toBeTruthy()
	})

	it ("Creation and loading of Examples", function() {
		var targetStore
		targetStore = ctrl.getStore("TargetExamples")
		expect(targetStore).toBeTruthy()

		waitsFor (
			function () {
				return !targetStore.isLoading()
			},
			"TargetStore never loaded",
			4000
		)

		expect(targetStore.getCount()).toEqual(4)
	})


	it ("Creation and loading of Pathways", function () {
		var keggStore = ctrl.getStore("KeggPathways")
		expect (keggStore).toBeTruthy()

		keggStore.proxy.extraParams = {
			protein: "Q13362"
		}
		keggStore.load()
		waitsFor (
			function () {
				return !keggStore.isLoading()
			},
			"Kegg store never loaded",
			4000
		)

		expect (keggStore.getCount()).toBeGreaterThan(1)
		expect (keggStore.getCount()).toBeLessThan(5)
	})
})