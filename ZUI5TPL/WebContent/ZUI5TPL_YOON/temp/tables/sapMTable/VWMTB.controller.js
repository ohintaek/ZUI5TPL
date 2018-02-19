sap.ui.define([
	"jquery.sap.global",
	"com/ui5/yoon/controller/BaseController",
	"com/ui5/yoon/controller/CommonUtil",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (jQuery, Controller, CommonUtil, ODataModel, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.tables.sapMTable.VWMTB", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWMTB").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var jsonModel = new JSONModel(jQuery.sap.getModulePath("com.ui5.yoon.models", "/customers.json"));
			this.getView().setModel(jsonModel);
		
			var oModel = new ODataModel(CommonUtil.getOdataServiceUrl(), true);
			
			var oTable = this.getView().byId("mtable");
			oTable.setModel(jsonModel);
			oTable.bindItems({
				path : "/customers",
				template : new sap.m.ColumnListItem({
					cells : [
						new sap.m.Text({ text : "{name}"}),
						new sap.m.Text({ text : "{productId}"}),
//						new sap.m.Text({ text : "{lastPurchase}"}),
						new sap.m.DatePicker().bindProperty("value", "lastPurchase", function(cellValue){
//							var oFormat = 
						}),
					/*	new sap.m.DatePicker({ 
							value : {
								path: '/lastPurchase',
								type: 'sap.ui.model.type.Date',
								formatOptions : {
									source : { pattern : 'dd-MM-yyyy' },
									pattern: 'dd-MM-yyyy',
								}
//								formatOptions : {
//									source : { pattern : 'yyyy-MM-dd' },
//									pattern: 'yyyy-MM-dd'
//								},
							},
//							width : "9rem"
						}),*/
						new sap.m.Text({ text : "{payment}"}),
						new sap.m.ObjectStatus({ text : "{state}", state : "{state}"}),
						new sap.m.ObjectNumber({ number : "{amount}", unit : "{currencyCode}"})
					]
				})
			})
		},
		
		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
	});

});

