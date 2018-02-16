sap.ui.define([
	"com/ui5/yoon/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.Main", {
		
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Main").attachPatternMatched(this.onRouteMatched, this);
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
			this.getRouter().navTo(sKey);
		},
		
		/*onItemSelect: function(oEvent) {
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();
			// if you click on home, settings or statistics button, call the navTo function
			if ((sKey === "home" || sKey === "masterSettings" || sKey === "statistics")) {
				// if the device is phone, collaps the navigation side of the app to give more space
				if (Device.system.phone) {
					this.onSideNavButtonPress();
				}
				this.getRouter().navTo(sKey);
			} else {
				MessageToast.show(sKey);
			}
		},
		*/
	});

});

