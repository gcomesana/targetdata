Ext.require('Ext.app.Application');

var Application = null;

Ext.onReady(function() {
	Application = Ext.create('Ext.app.Application', {
		name: 'TD',
		appFolder: "app",

		controllers: [
			"TargetInfo",
			"CenterTabs"
		],

		launch: function() {
			//include the tests in the test.html head
			jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
			jasmine.getEnv().execute();
		}
	});
});