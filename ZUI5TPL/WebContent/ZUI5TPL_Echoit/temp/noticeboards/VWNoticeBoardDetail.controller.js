sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, CommonUtil, Filter, FilterOperator, JSONModel, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.noticeboards.VWNoticeBoardDetail", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWNoticeBoardDetail").attachMatched(this.onRouteMatched, this);
			
		},
		
		onRouteMatched : function(oEvent) {
			var sRouteParam = oEvent.getParameter("arguments");
			var noticeNumber = sRouteParam.noticeNumber;
			this.getNoticeInfo(noticeNumber);
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		getNoticeInfo : function(noticeNumber) {
			var akeyValue = [{
					key : "Noticeno",
					value : noticeNumber
			}]
			var aNoticeRead = CommonUtil.getGatewayReadData("/ZUI5TPL_TESTSet", akeyValue);
			if(aNoticeRead.EType == "E")
				return;
			var aNoticeInfo = JSON.parse(aNoticeRead.OutputJson);
			
			var JsonModel = new JSONModel(aNoticeInfo);
			this.getView().setModel(JsonModel);
		}
	
	});

});

