sap.ui.define([
	"com/ui5/yoon/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.yoon.temp.Home", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Home").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var oSource = oEvent.getSource();
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
	});

});

