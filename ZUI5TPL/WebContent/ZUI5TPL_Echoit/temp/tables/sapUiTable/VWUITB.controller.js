sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.tables.sapUiTable.VWUITB", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWUITB").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var oSource = oEvent.getSource();
		},
		
		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		// Panel Background Change
		onPanelBgChange : function(oEvent){
			var oCheck = oEvent.getSource();
			
			var isCheck = oCheck.getSelected();
			
			var sPropName = oCheck.getProperty("text");
			
			var oPanel = this.getView().byId("Panel1");
			if(isCheck){
				oPanel.setBackgroundDesign(sPropName);
			} else {
				oPanel.setBackgroundDesign("Translucent");
			}
		},
		
		// Panel Expanded
		onPanelExpended : function(oEvent){
			var isCheck = oEvent.getSource().getSelected();
			
			var oPanel = this.getView().byId("Panel1");
			
				oPanel.setExpandable(isCheck);
				oPanel.setExpandAnimation(isCheck);
				oPanel.setExpanded(isCheck);
		},
		
		// HBox BackgoundDesign Change
		onHBoxBgChange : function(oEvent){
			var oCheck = oEvent.getSource();
			
			var isCheck = oCheck.getSelected();
			
			var sPropName = oCheck.getProperty("text");
			
			var oHBox = this.getView().byId("p2_HBox");
			if(isCheck){
				oHBox.setBackgroundDesign(sPropName);
			} else {
				oHBox.setBackgroundDesign("Translucent");
			}
		}
		
	});

});

