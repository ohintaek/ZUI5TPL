sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.Main", {
		
		onInit : function() {
			
		},
		
		onRouteMatched : function(oEvent) {
			var oSource = oEvent.getSource();
		},
		
		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		onSideNavButtonPress: function() {
			var oToolPage = this.byId("ToolApp");
			var bSideExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		
		onItemSelect : function(oEvent){
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();
			
			var oRouter = this.getRouter();
			if(oRouter.getRoute(sKey) == null)
				return;
			
			oRouter.navTo(sKey);
		},
		
		onPressHome : function(oEvent){
			this.getRouter().navTo("Home");
		},
	});

});

