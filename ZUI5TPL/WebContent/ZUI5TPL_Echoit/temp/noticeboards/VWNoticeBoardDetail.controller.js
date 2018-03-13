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
			this.onPageInit();
			
			var sRouteParam = oEvent.getParameter("arguments");
			var noticeNumber = sRouteParam.noticeNumber;
			this.getNoticeDetailInfo(noticeNumber);
		},

		onNavBack: function() {
			this.onPageInit();
			Controller.prototype.onNavBack.apply(this);
		},
		
		onPageInit : function(){
			var ObjPageSelection = this.getView().byId("NoticePageSection1");
			
			var ObjPageLayout = this.getView().byId("NoticeObjPageLayout");
				ObjPageLayout.setSelectedSection(ObjPageSelection.sId);
		},
		
		getNoticeDetailInfo : function(noticeNumber) {
			var akeyValue = [{
					key : "Noticeno",
					value : noticeNumber
			}]
			
			var aNoticeRead = CommonUtil.getGatewayReadData("/ZUI5TPL_NOTICESet", akeyValue);
			if(aNoticeRead.EType == "E")
				return;
			
			// 공지사항 정보를 구한다.
			var aNoticeInfo = JSON.parse(aNoticeRead.OutputJson);

			var JsonModel = new JSONModel({ notice : aNoticeInfo[0]});
			this.getView().setModel(JsonModel);
		},
		
		// 공지사항 상세화면의 댓글을 저장한다.
		onReplyPost : function(oEvent){
			
			// 현재 날짜와 시간을 구한다.
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
			var sCurrentDate = oDateFormat.format(new Date());
			
			var oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "HHmmdd" });
			var sCurrentTime = oTimeFormat.format(new Date());
			
			var oModel = this.getView().getModel();
			var oNoticeData = oModel.getData().notice;
			if(oNoticeData == null)
				return;
			
			// 댓글 내용을 구한다.
			var sValue = oEvent.getParameter("value");
		
			var oReplyInfo = {
					noticeno :  oNoticeData.NOTICENO,
					feedcontent : sValue,
					feedcrdate : sCurrentDate,
					feedcrtime : sCurrentTime,
			}
			
			var gwParam = {
					ZInput : JSON.stringify(oReplyInfo),
					ZFlag : "NOTICE_REPLY",
					IOperation : "C"
			}
			
			var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_NOTICESet", gwParam);
			MessageToast.show(result.EMsg);
			
			
			
			
		/*	
			var oEntry = {
					USERID: "홍길동",
					FEEDINFO: sValue,
					FEEDDATE: oDate,
				};
			
			// update model
			var oModel = this.getView().getModel();
			var JModel = new JSONModel();
			
			var oModelData = oModel.getData();
			if(oModelData.FeedItems == null){
				oModelData.FeedItems = [oEntry];
			} else {
				oModelData.FeedItems.unshift(oEntry);
			}
				oModel.refresh();
				
			var oNoticeData = oModelData.notice;
			if(oNoticeData == null)
				return;
			
			var oReplyInfo = {
					noticeno :  oNoticeData.NOTICENO,
					feedcontent : sValue,
					feedcrdate : sCurrentDate,
					feedcrtime : sCurrentTime,
			}	*/
				
		}
	
	});

});

