

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
		padding:'0 20 0 0',
		pack:'end',
		align:'middle',
		defaultMargins: {
			top: 0,
			right: 20,
			bottom: 0,
			left: 0
		}
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
						src: "resources/images/app/targetdata_bottom.png",
						height: 100,
						width: 400,
						style: {
							padding: '0 10 0 10'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/OPS_logo_med_transp.gif",
						height: 70,
						width: 140,
						style: {
							padding: '0 10 0 50'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/cnio_corp_trans.gif",
						height: 70,
						width: 90,
						style: {
							padding: '0 10 0 50'
						}
					}),
					Ext.create("Ext.Img", {
						src: "resources/images/app/inb_corp_trans.png",
						height: 70,
						width: 110,
						style: {
							padding: '0 10 0 50'
						}
					})
//				]}
			]

		this.callParent(arguments);
	}

})