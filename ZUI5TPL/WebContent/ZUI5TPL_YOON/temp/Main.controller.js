sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.Main", {
		
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("temp").attachPatternMatched(this.onRouteMatched, this);
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
				this._oRouter.navTo("master");
			}
		},
		
		onSideNavButtonPress: function() {
			var oToolPage = this.byId("ToolApp");
			var bSideExpanded = oToolPage.getSideExpanded();
//			this._setToggleButtonTooltip(bSideExpanded);
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		
		onItemSelect : function(oEvent){
			var evt = oEvent;
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();
		}
		
	});

});

