sap.ui.define([
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, CommonUtil, JSONModel, History, MessageToast) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.noticeboards.VWNoticeBoard", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWNoticeBoard").attachPatternMatched(this.onRouteMatched, this);
			
			var oModel = new JSONModel({createDate : new Date()});
			this.getView().setModel(oModel);
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
				this.oNoticeDialog = sap.ui.xmlfragment(this.getView().getId(),"com.ui5.echoit.temp.noticeboards.FRNoticeCreate", this);
				this.getView().addDependent(this.oNoticeDialog);
			}
			
			this.oNoticeDialog.open();
		},
		
		// 공지사항의 신규등록 팝업 닫기
		onPressDialogClose : function(){
			this.oNoticeDialog.close();
		},
		
		// 공지사항 등록
		onPressNoticeCreate : function(){
			try {
				var sNoticeWriter = this.getView().byId("noticeWriter").getValue();
				if(sNoticeWriter == '')
					throw "작성자를 입력하세요";
				
				var sNoticeTitle = this.getView().byId("noticeTitle").getValue();
				if(sNoticeTitle == ''){
					throw "제목을 입력하세요";
				}
				
				var sNoticeContent = this.getView().byId("noticeArea").getValue();
				var bImportantNotice = this.getView().byId("importantNotice").getSelected();
				var bNoticeAll = this.getView().byId("globalNotice").getSelected();
				
				// 공지사항 정보를 저장
				var noticeInfo = {
						noticetitle 	: sNoticeTitle,
						noticecontents 	: sNoticeContent,
						impflag 		: (bImportantNotice ? "X" : ""),
						noticeall 		: (bNoticeAll ? "X" : ""),
						crusername 		: sNoticeWriter
				}
				
				// Gateway를 호출하기 위한 Parameter
				var gwParam = {
						ZInput : JSON.stringify(noticeInfo)
				}
				
				var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_TESTSet", gwParam);
				MessageToast.show(result.Emsg);
				
				// 공지사항 팝업창 닫기
				if(this.oNoticeDialog){
					this.oNoticeDialog.close();
				}
				
				// 공지사항 테이블에 바인딩
				var oFilter = [
					new Filter("ZFlag", FilterOperator.EQ, "GETNOTICEINFO")
				];
				
				var selectResult = CommonUtil.getGatewayReadData(oFilter, "/ZUI5TPL_TESTSet");
				var oTable = this.getView().byId("noticeTable");
				
			} catch(ex) {
				
				MessageToast.show(ex);
			}
		}
	});

});

