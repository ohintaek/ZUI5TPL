sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat"
], function (Controller, CommonUtil, Filter, FilterOperator, JSONModel, History, MessageToast, DateFormat) {
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

			var JsonModel = new JSONModel(aNoticeInfo[0]);
			this.getView().setModel(JsonModel);
		},
		
		// 공지사항 상세화면의 댓글을 저장한다.
		onReplyPost : function(oEvent){
			var oFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
//			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ format: "yyyy-MM-dd" });
			var oDate = new Date();
			var sDate = oFormat.format(oDate);
			
			// create new entry
			var sValue = oEvent.getParameter("value");
			var oEntry = {
					USERID: "홍길동",
					FEEDINFO: sValue,
					FEEDDATE: "" + sDate,
				};
			
			// update model
//			var jsonModel = new JSONModel();
//			jsonModel.setData({FeedItems : oEntry});
			this.getView().getModel().setData({FeedItems : oEntry});
			
			/*var oModel = this.getView().getModel();
			var aEntries = oModel.getData().FEED;
			aEntries.unshift(oEntry);
			oModel.setData({aEntries});*/
		}
	
	});

});

