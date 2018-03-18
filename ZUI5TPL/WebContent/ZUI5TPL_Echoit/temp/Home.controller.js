sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, CommonUtil, History, Filter, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.Home", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Home").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			this.setTileContentInit();
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		// 공지사항의 총 갯수를 구한다.
		setTileContentInit : function(){
			var oFilter = [
				new Filter("ZFlag", FilterOperator.EQ, "NOTICECOUNT")
			];
			
			var selectResult = CommonUtil.getGatewayQueryData(oFilter, "/ZUI5TPL_NOTICESet");
			if(selectResult[0].EType == "E")
				return;
			
			var oNoticeTile = this.getView().byId("noticeTile");
			oNoticeTile.setNumber(selectResult[0].NoticeAllCount);
		},
		
		// 공지 사항 화면으로 이동한다.
		onPressNotice : function(){
			this.getRouter().navTo("VWNoticeBoard");
		}
	});

});

