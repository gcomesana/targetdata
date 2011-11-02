

Ext.define ("TD.view.panel.NorthPanel", {
//	extend			: 'Ext.form.Panel',
	extend: "Ext.Component",
	alias			 : 'widget.northpanel',
//	height: 250,

	bodyBorder: true,
	frame: true,

	autoEl: {
/*		tag: 'div',
		html:'<p><b>NORTH (via xtype)</b> - generally for menus, toolbars and/or advertisements</p>'
*/
		tag: "div",
		html: "<img src=\"resources/images/app/OPS_logo_med_transp.gif\" width=\"200\" height=\"105\" />"
	},

	title: "Northern panel",

//	bodyStyle	 : 'padding: 10px; background-color: #DCE5F0; border-left: none;',
//	defaultType : 'textfield',
//	defaults		: {
//		anchor		 : '-10',
//		labelWidth : 70
//	},

	initComponent : function() {
		this.callParent();
	}

})