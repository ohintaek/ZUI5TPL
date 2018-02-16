sap.ui.define([
	"com/ui5/yoon/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.tables.VWMTB", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("mtable").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var oSource = oEvent.getSource();
		},
		
		onNavBack: function() {
			var oHistory = History.getInstance();
			
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined){	
				window.history.go(-1);
			} else {
				this._oRouter.navTo("main");
			}
		},
		
	});

});

