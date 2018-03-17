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
			try { 
				var oPath = oEvent.getSource().getBindingContext().sPath;
				var oBindData = this.getView().getModel().getProperty(oPath);
				this.sNoticeNo = oBindData.NOTICENO;
				
				sap.m.MessageBox.confirm("정말 삭제 하시겠습니까?", {
				    actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				    onClose: function(oAction){
				    	 if(oAction == "YES"){
				 			
				    		 var gwParam = {
				 					Noticeno : this.sNoticeNo,
				 					INotice : "X",
				 					IOperation : "D"
				 			}
				 			
				 			var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_NOTICESet", gwParam);
				 			if(result.EType == "E")
				 				throw MessageToast.show(result.EMsg);
				    		 
				 			this.getRouter().navTo("VWNoticeBoard");
				 			
				    	 } else {
				    		 return;
				    	 }
				    }.bind(this)
			    });
				
			} catch(ex) {
				MessageToast.show(ex);
			}
		},
		
		onPressNoticeUpdate : function(oEvent){
			var oPath = oEvent.getSource().getBindingContext().sPath;
			var oBindData = this.getView().getModel().getProperty(oPath);
			
			this.sNoticeno = oBindData.NOTICENO;
			
			if(!this.oNoticeDialog){
				this.oNoticeDialog = sap.ui.xmlfragment(this.getView().getId(),"com.ui5.echoit.temp.noticeboards.FRNoticeCreate", this);
				this.getView().addDependent(this.oNoticeDialog);
			}
			
			this.oNoticeDialog.setTitle("공지사항 수정");
			this.oNoticeDialog.setIcon("sap-icon://edit");
			this.getView().byId("noticeWriter").setValue(oBindData.CRUSERNAME);
			this.getView().byId("writeDate").setValue(oBindData.CREATEDATE);
			this.getView().byId("noticeTitle").setValue(oBindData.NOTICETITLE);
			this.getView().byId("noticeArea").setValue(oBindData.NOTICECONTENTS);
			this.getView().byId("globalNotice").setSelected(oBindData.NOTICEALL == "X" ? true : false);
			this.getView().byId("importantNotice").setSelected(oBindData.IMPFLAG == "X" ? true : false);
			
			this.oNoticeDialog.open();
		},
		
		// 공지사항 수정 팝업 닫기
		onPressDialogClose : function(){
			this.oNoticeDialog.close();
		},
		
		// 수정된 공지사항을 저장한다.
		onPressNoticeSave : function(){
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
			var sNoticeNo = this.sNoticeno;
			
			// 공지사항 정보를 저장
			var noticeInfo = {
					noticeno		: sNoticeNo,
					noticetitle 	: sNoticeTitle,
					noticecontents 	: sNoticeContent,
					impflag 		: (bImportantNotice ? "X" : ""),
					noticeall 		: (bNoticeAll ? "X" : ""),
					crusername 		: sNoticeWriter
			}
			
			// Gateway를 호출하기 위한 Parameter
			var gwParam = {
					ZInput 		: JSON.stringify(noticeInfo),
					INotice		: "X",
					IOperation 	: "U"
			}
			
			var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_NOTICESet", gwParam);
			if(result.EType == "E"){
				MessageToast.show(result.EMsg);
			} else {
				// 공지사항 팝업창 닫기
				if(this.oNoticeDialog){
					this.oNoticeDialog.close();
				}
				
				this.getRouter().navTo("VWNoticeBoard");
			}
			
			
//			// 공지사항 테이블에 바인딩
//			this.getNoticeDetailInfo(sNoticeNo);
			
			
		}
	
	});

});

