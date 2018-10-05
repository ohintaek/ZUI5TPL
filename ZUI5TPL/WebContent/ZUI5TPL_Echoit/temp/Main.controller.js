sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"sap/ui/core/routing/History"
], function (Controller, History) {
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
			com.ui5.echoit.controller.BaseController.prototype.onMenuButton.call(this);
			var oToolPage = this.byId("ToolApp");
			var bSideExpanded = oToolPage.getSideExpanded();
			oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
		},
		
		onPressItemSelect : function(oEvent){
			var oItem = oEvent.getParameter('item');
			var sKey = oItem.getKey();
			
			var oRouter = this.getRouter();
			if(oRouter.getRoute(sKey) == null){
				return;
			}
			
			var iDuration = 300;
			var iDelay = 0;
			sap.ui.core.BusyIndicator.show(iDelay);
			
			if(iDuration > 0){
				if(this._sTimeoutId){
					jQuery.sap.clearDelayedCall(this._sTimeoutId);
					this._sTimeoutId = null;
				}
				
				this._sTimeoutId = jQuery.sap.delayedCall(iDuration, this, function(){
					oRouter.navTo(sKey);
					sap.ui.core.BusyIndicator.hide();
				})
			}
		},
		
		onPressHome : function(oEvent){
			this.getRouter().navTo("Home");
		},
	});

});

