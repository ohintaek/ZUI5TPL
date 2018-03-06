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
			this.getNoticeDetailInfo(noticeNumber);
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		getNoticeDetailInfo : function(noticeNumber) {
			var akeyValue = [{
					key : "Noticeno",
					value : noticeNumber
			}]
			var aNoticeRead = CommonUtil.getGatewayReadData("/ZUI5TPL_TESTSet", akeyValue);
			if(aNoticeRead.EType == "E")
				return;
			
			// 공지사항 정보를 구한다.
			var aNoticeInfo = JSON.parse(aNoticeRead.OutputJson);
			
			/*var objStatus = this.getView().byId("NoticeObjStatus");
			if(aNoticeInfo[0].IMPFLAG == "X"){
				objStatus.setIcon("sap-icon://alert");
				objStatus.setText("중요");
				objStatus.setState("Error");
			} else {
				objStatus.setIcon();
				objStatus.setText();
				objStatus.setState();
			}*/
			
			
			var JsonModel = new JSONModel(aNoticeInfo[0]);
			this.getView().setModel(JsonModel);
			
			
			
		}
	
	});

});

