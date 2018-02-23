sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.noticeboards.VWNoticeBoard", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWNoticeBoard").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			var oSource = oEvent.getSource();
		},

		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		// 공지사항의 신규등록 팝업 열기
		onBoardCreatePopup : function() {
			if(!this.oNoticeDialog){
				this.oNoticeDialog = sap.ui.xmlfragment("com.ui5.echoit.temp.noticeboards.FRNoticeCreate", this);
				this.getView().addDependent(this.oNoticeDialog);
			}
			
			this.oNoticeDialog.open();
		},
		
		// 공지사항의 신규등록 팝업 닫기
		onPressDialogClose : function(){
			this.oNoticeDialog.close();
		}
	});

});

