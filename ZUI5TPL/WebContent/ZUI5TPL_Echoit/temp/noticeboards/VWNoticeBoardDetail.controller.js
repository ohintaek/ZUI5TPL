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
			this.onInitTabFocus();
			
			var sRouteParam = oEvent.getParameter("arguments");
			var noticeNumber = sRouteParam.noticeNumber;
			this.getNoticeDetailInfo(noticeNumber);
		},

		onNavBack: function() {
			this.onInitTabFocus();
			Controller.prototype.onNavBack.apply(this);
		},
		
		onInitTabFocus : function(){
			var ObjPageSelection = this.getView().byId("NoticePageSection1");
			
			var ObjPageLayout = this.getView().byId("NoticeObjPageLayout");
				ObjPageLayout.setSelectedSection(ObjPageSelection.sId);
		},
		
		// 공지사항 번호를 가지고 댓글 정보를 구한다.
		getNoticeDetailInfo : function(noticeNumber) {

			var akeyValue = [
				{ key : "Noticeno", value : noticeNumber },
				{ key : "Replyno",  value : "" },
			]
			
			var aNoticeRead = CommonUtil.getGatewayReadData("/ZUI5TPL_NOTICESet", akeyValue);
			if(aNoticeRead.EType == "E")
				return;
			
			// 공지사항 정보를 구한다.
			var aNoticeInfo = JSON.parse(aNoticeRead.OutputJson);
			
			// 공지사항 (header) 정보와 댓글 (Item) 정보를 나눈다.
			var aNotice = [];
			var aReply = [];
			for(var i = 0; i < aNoticeInfo.length; i++){
				if(aNoticeInfo[i].REPLYNO == "0000000000")
					aNotice.push(aNoticeInfo[i]);
				else
					aReply.push(aNoticeInfo[i]);	
			}
			aNotice[0].FeedItems = aReply;
			
			var JsonModel = new JSONModel({ notice : aNotice[0] });
			this.getView().setModel(JsonModel);
			
			var FeedModel = new JSONModel({feed : aReply});
			var oFeedList = this.getView().byId("NoticeFeedList");
			oFeedList.setModel(FeedModel);
			oFeedList.bindItems({
				path : "/feed",
				template : new sap.m.FeedListItem({
					sender  : "{REPLYUSERID}",
					text 	: "{REPLYCONTENT}",
					maxCharacters : 100,
					iconActive : false,
					senderActive : false
				}).bindProperty("timestamp", {
					parts : [
						{ path : 'REPLYCRDATE' },
						{ path : 'REPLYCRTIME' }
					],
					formatter : function(date, time){
						if(date == "" || time == "")
							return;
						var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
						var oDate = oDateFormat.parse(date);
						var oDateFormatCnv = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
						var sConvDate = oDateFormatCnv.format(oDate);
						
						var oTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "HHmmdd" });
						var oTime = oTimeFormat.parse(time);
						var oTimeFormatCnv = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "HH:mm:dd" });
						var sConvTime = oTimeFormatCnv.format(oTime);
						
						return sConvDate + " " + sConvTime;
					}
				})
			})
			
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
					replycontent : sValue,
					replycrdate : sCurrentDate,
					replycrtime : sCurrentTime
			}
			
			var gwParam = {
					ZInput : JSON.stringify(oReplyInfo),
					IReply : "X",
					IOperation : "C"
			}
			
			var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_NOTICESet", gwParam);
			if(result.EType == "E")
				MessageToast.show(result.EMsg);
			
			this.getNoticeDetailInfo(oNoticeData.NOTICENO);
	
		},
		
		// 공지사항의 댓글을 삭제한다.
		onPressNoticeListDelete : function(oEvent){
			this.bindPath = oEvent.getParameter("listItem").getBindingContext().sPath;
			
			sap.m.MessageBox.confirm("정말 삭제 하시겠습니까?", {
			    actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			    onClose: function(oAction){
			    	 if(oAction == "YES"){
			 			var oList = this.getView().byId("NoticeFeedList");
			 			var oListModel = oList.getModel();
			 			var oDelListData = oListModel.getProperty(this.bindPath);
			 			
			 			var sNoticeNo = oDelListData.NOTICENO;
			 			var sReplyNo = oDelListData.REPLYNO;
			 			
			 			var akeyValue = [
			 				{ key : "Noticeno", value : sNoticeNo },
			 				{ key : "Replyno",  value : sReplyNo },
			 			]
			 			
			 			var aNoticeRead = CommonUtil.getGatewayDeleteData("/ZUI5TPL_NOTICESet", akeyValue);
			 			
			 			this.getNoticeDetailInfo(sNoticeNo);
			 			
			    	 } else {
			    		 return;
			    	 }
			    }.bind(this)
		    });
		},
		
		// 공지사항을 삭제한다.
		onPressNoticeDelete : function(oEvent){
			var oSource = oEvent.getSource();
			
			var oPath = oEvent.getSource().getBindingContext().sPath;
			var oBindData = this.getView().getModel().getProperty(oPath);
			var sNoticeNo = oBindData.NOTICENO;
			
			
		}
	
	});

});

