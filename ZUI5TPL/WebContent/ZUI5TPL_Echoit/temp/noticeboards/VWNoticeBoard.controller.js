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

	return Controller.extend("com.ui5.echoit.temp.noticeboards.VWNoticeBoard", {
		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWNoticeBoard").attachMatched(this.onRouteMatched, this);
			
			var oModel = new JSONModel({createDate : new Date()});
			this.getView().setModel(oModel);
		},
		
		onRouteMatched : function(oEvent) {
			// 공지사항 정보 가져오기
			this.getNoticeInfo();
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
		onPressNoticeSave : function(){
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
						ZInput 		: JSON.stringify(noticeInfo),
						INotice		: "X",
						IOperation 	: "C"
				}
				
				var result = CommonUtil.setGatewayCreateData("/ZUI5TPL_NOTICESet", gwParam);
				MessageToast.show(result.EMsg);
				
				// 공지사항 팝업창 닫기
				if(this.oNoticeDialog){
					this.oNoticeDialog.close();
				}
				
				// 공지사항 테이블에 바인딩
				this.getNoticeInfo();
				
			} catch(ex) {
				
				MessageToast.show(ex);
			}
		},
		
		// 공지사항의 전체 데이터를 테이블에 바인딩 한다.
		getNoticeInfo : function(){
			var oFilter = [
				new Filter("ZFlag", FilterOperator.EQ, "GETNOTICEINFO"),
				new Filter("INotice", FilterOperator.EQ, "X"),
				new Filter("IOperation", FilterOperator.EQ, "Q")
			];
			
			var selectResult = CommonUtil.getGatewayQueryData(oFilter, "/ZUI5TPL_NOTICESet");
			if(selectResult[0].EType == 'E')
				throw selectResult[0].EMsg;
			
			// 공지 사항 정보를 구한다.
			var aNoticeData = JSON.parse(selectResult[0].OutputJson);
			
			// 공지사항 정보 중 중요 공지사항을 상단에 위치 한다.
			aNoticeData.sort(function(a,b){
				return (a.NOTICEALL == 'X') ? -1 : (a.NOTICEALL != 'X') ? 1 : 0;
			});
			
			var jsonModel = new JSONModel();
			jsonModel.setData(aNoticeData);
			
			var oTable = this.getView().byId("noticeTable");
			oTable.setModel(jsonModel);
			oTable.bindItems({
				path : '/',
				template : new sap.m.ColumnListItem({
					type : 'Active',
					press : function(oEvent){
						this.onPressItem(oEvent);
					}.bind(this),
					cells : [
						new sap.m.HBox({
							alignContent : "Center",
							alignItems : "Center",
							justifyContent : "Center",
							items : [
								new sap.m.ObjectStatus().bindProperty("state", "IMPFLAG", function(cellValue){
									if(cellValue == 'X')
										return 'Error';
								}).bindProperty("icon", "IMPFLAG", function(cellValue){
									if(cellValue == 'X')
										return "sap-icon://alert";
								}),
								new sap.m.ObjectStatus().bindProperty("icon", "NOTICEALL", function(cellValue){
									if(cellValue == 'X')
										return "sap-icon://marketing-campaign";
								}),
							]
						}),
						new sap.m.Text({ text : "{NOTICETITLE}"}),
						new sap.m.Text({ text : "{CRUSERNAME}"}),
						new sap.m.Text({ text : "{CREATEDATE}"})
						
					]
				})
			});
		},
		
		// 선택한 공지사항의 상세 정보 페이지로 이동한다.
		onPressItem : function(oEvent){
			var oTable = this.getView().byId("noticeTable");
			var oTableModel = oTable.getModel();
			var selectedContext = oEvent.getSource().getBindingContext();
			
			var sNoticeNumber = oTableModel.getProperty(selectedContext.sPath).NOTICENO;
			this.getRouter().navTo("VWNoticeBoardDetail", { noticeNumber: sNoticeNumber });
		},
		
		// Search Field 
		onSearchFieldLiveChange : function(oEvent){
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if(sQuery && sQuery.length > 0){
				var oFilter = new Filter("NOTICETITLE", FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}
			
			var oTable = oEvent.getSource().getParent().getParent();
			var binding = oTable.getBinding("items");
			binding.filter(aFilters, "Application");
		}
	});

});

