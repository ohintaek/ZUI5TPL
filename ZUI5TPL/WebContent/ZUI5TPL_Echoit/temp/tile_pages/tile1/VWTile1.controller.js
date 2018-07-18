sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.tile_pages.tile1.VWTile1", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWTile1").attachPatternMatched(this.onRouteMatched, this);
			
		},
		
		onRouteMatched : function(oEvent) {
			this.onDefaultSettings();
			
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
			
		},
		
		onDefaultSettings : function() {
			var oSlider = this.getView().byId("Slider01");
			oSlider.setValue(50);
		}
	});

});

