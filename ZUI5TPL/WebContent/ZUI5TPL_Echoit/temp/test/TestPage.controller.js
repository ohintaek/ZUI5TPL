sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, CommonUtil, History, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.test.TestPage", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("TestPage").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		
	});

});

