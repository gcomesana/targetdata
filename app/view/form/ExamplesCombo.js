/**
 * This combo just contains straight examples to show the features of the application
 * The examples are in resources/data/examples.json.
 * A model and a store has to be built in order to read the examples
 */

// var examplesStore = Ext.create ("TD.store.TargetExamples");

Ext.define ("TD.view.form.ExamplesCombo", {
	extend: "Ext.form.field.ComboBox",
	alias: "widget.examples-combo",
	requires: ['TD.model.TargetExample', 'TD.store.TargetExamples'],

	store: Ext.create ("TD.store.TargetExamples"),
	displayField: 'text',
	valueField: 'acc',
	queryMode: 'remote',
	triggerAction: 'all',
	emptyText: 'Choose an example...',
	forceSelection: true,

	listConfig: {
		getInnerTpl: function() {
			return '<div>{acc}<br>' +
				'<small><i><b>{text}</b><br/></i></small></div>';
		}
	},

	initComponent: function (arguments) {
		var me = this

		me.listeners = {
			'afterrender': function (comp, opts) {
				Ext.tip.QuickTipManager.register({
					target: comp.getEl(),
					text: '<span style="font-size: larger;"> Choose an entry from the combobox below...</span>'
				});
			},

			'select': function (field, value, opts) {
				

			}
			 // EO listeners
		}
		me.callParent(arguments)
	}
})