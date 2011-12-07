

Ext.define ("TD.view.panel.NorthPanel", {
	extend			: 'Ext.form.Panel',
//	extend: "Ext.Component",
	alias			 : 'widget.northpanel',
//	height: 250,

//	bodyBorder: true,
	frame: true,
	border: 0,
/*
	autoEl: {
		tag: "div",
		html: "<img src=\"resources/images/app/OPS_logo_med_transp.gif\" width=\"200\" height=\"105\" />"
	},
*/
//	title: "Northern panel",
	layout: {
		type: 'hbox',
		padding:'5',
		pack:'end',
		align:'middle'
	},

	bodyStyle	 : 'padding: 10px; background-color: #DCE5F0; border-left: none;',
//	defaultType : 'textfield',
//	defaults		: {
//		anchor		 : '-10',
//		labelWidth : 70
//	},

	initComponent : function() {
		this.items = [
					Ext.create("Ext.Img", {
						src: "resources/images/app/tdtitle-bottom.png",
						height: 105,
						width: 640,
						style: {
							padding: '0 10 0 50'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/OPS_logo_med_transp.gif",
						height: 105,
						width: 200,
						style: {
							padding: '0 10 0 50'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/cnio_corp_trans.gif",
						height: 105,
						width: 130,
						style: {
							padding: '0 10 0 50'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/inb_corp_trans.png",
						height: 105,
						width: 150,
						style: {
							padding: '0 10 0 50'
						}
					})
//				]}
			]

		this.callParent(arguments);
	}

})