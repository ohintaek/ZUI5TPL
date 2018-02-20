sap.ui.define([
	"com/ui5/yoon/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.tables.sapMTable.VWMTB", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWMTB").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var jsonModel = new JSONModel(jQuery.sap.getModulePath("com/ui5", "/models/customers.json"));
//				jsonModel.attachRequestCompleted(function(oEvent){  
//					var ModelNEW = oEvent.getSource();
//				});
				
//			jsonModel.loadData("com/ui5/models/customers.json");
//			jsonModel.loadData("../../../../models/customers.json");
			
			var oTable = this.getView().byId("mtable");
			
		},
		
		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
	});

});

