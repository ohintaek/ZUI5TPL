sap.ui.define([
	"jquery.sap.global",
	"com/ui5/echoit/controller/BaseController",
	"com/ui5/echoit/controller/CommonUtil",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (jQuery, Controller, CommonUtil, ODataModel, Filter, FilterOperator, History, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.ui5.echoit.temp.tables.sapMTable.VWMTB", {

		onInit : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("VWMTB").attachPatternMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched : function(oEvent) {
			// sample Code for Odata Model Binding Method via SAP Gateway.
			this.getOdataModelBinding();
			
			// sample Code for Json Model Binding Method via local Json file.
			this.getJsonModelBinding();
		},
		
		onNavBack: function() {
			Controller.prototype.onNavBack.apply(this);
		},
		
		// Json Model Table Binding
		getJsonModelBinding : function(){
			var jsonModel = new JSONModel(jQuery.sap.getModulePath("com.ui5.echoit.models", "/customers.json"));
			this.getView().setModel(jsonModel);
			
			var oTable = this.getView().byId("mtableJson");
			oTable.setModel(jsonModel);
			oTable.bindItems({
				path : "/customers",
				template : new sap.m.ColumnListItem({
					cells : [
						new sap.m.Text({ text : "{name}"}),
						new sap.m.Text({ text : "{productId}"}),
						new sap.m.Text({ text : "{lastPurchase}"}),
//						new sap.m.DatePicker({ value : "{lastPurchase}", width : "9rem"}),
						/*new sap.m.DatePicker().bindProperty("value", "lastPurchase", function(cellValue){
							return new Date(cellValue); 
						}),*/
						/*new sap.m.DatePicker({ 
							value : {
								path: 'lastPurchase',
								type: 'sap.ui.model.type.Date',
								formatOptions : {
									source : { pattern : 'dd-MM-yyyy' },
									pattern: 'dd-MM-yyyy',
								}
								formatOptions : {
									source : { pattern : 'yyyy-MM-dd' },
									pattern: 'yyyy-MM-dd'
								},
							},
							width : "9rem"
						}),*/
						new sap.m.Text({ text : "{payment}"}),
						new sap.m.ObjectStatus({ text : "{state}", state : "{state}"}),
						new sap.m.ObjectNumber({ number : "{amount}", unit : "{currencyCode}"})
					]
				})
			})
		},
		
		// OData Model Table Binding 
		getOdataModelBinding : function() {
			
			var oFilter = [
				new Filter("ZFlag", FilterOperator.EQ, "TABLEBINDING")
			];
			
			var result = CommonUtil.getGatewayReadData(oFilter, "/ZUI5TPL_TESTSet");
			if(result == null)
				return;
			var outputjson = JSON.parse(result[0].OutputJson);
			
			var jsonModel = new JSONModel();
			jsonModel.setData(outputjson);
			
			var oTable = this.getView().byId("mtable");
			oTable.setModel(jsonModel);
			oTable.bindItems({
				path : "/",
				template : new sap.m.ColumnListItem({
					cells : [
						new sap.m.Link({ 
							text : "{CARRID}",
							press: function(oEvent){
								this.onPressAirLineCode(oEvent);
							}.bind(this)
						}),
						new sap.m.Text({ text : "{CONNID}"}),
						new sap.m.Text({
							text : {
								path: 'FLDATE',
								type: 'sap.ui.model.type.Date',
								formatOptions : {
									source : { pattern : 'yyyy-MM-dd' },
									pattern: 'yyyy-MM-dd',
								}
							}
						}),
						new sap.m.Text({ text : "{PRICE}"}),
						new sap.m.Text({ text : "{CURRENCY}"}),
						new sap.m.Text({ text : "{PLANETYPE}"}),
						new sap.m.Text({ text : "{SEATSMAX}"}),
						new sap.m.Text({ text : "{SEATSOCC}"}),
						new sap.m.Text({ text : "{PAYMENTSUM}"}),	
					]
				})
			});
		
		},
		
		// OData Model Binding 테이블의 SearchField
		onSearchFieldLiveChangeTop : function(oEvent){
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if(sQuery && sQuery.length > 0){
				var oFilter = new Filter("CARRID", FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}
			
			var oTable = oEvent.getSource().getParent().getParent();
			var binding = oTable.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		// JSON Model Binding 테이블의 SearchField
		onSearchFieldLiveChangeBottom : function(oEvent){
			var aFilters = [];
			var sQuery = oEvent.getSource().getValue();
			if(sQuery && sQuery.length > 0){
				var oFilter = new Filter("name", FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}
			
			var oTable = oEvent.getSource().getParent().getParent();
			var binding = oTable.getBinding("items");
			binding.filter(aFilters, "Application");
		},
		
		// AirLine Code 링크 선택 시 ...
		onPressAirLineCode : function(oEvent){
			var sAirLineCode = oEvent.getSource().getProperty("text");
			var oFilter = [
				new Filter("ZFlag", FilterOperator.EQ, "AIRLINE"),
				new Filter("Carrid", FilterOperator.EQ, sAirLineCode)
			];
			
			var result = CommonUtil.getGatewayReadData(oFilter, "/ZUI5TPL_TESTSet");
			var oAirLineInfo = JSON.parse(result[0].OutputJson);
			
			var oJsonModel = new JSONModel(oAirLineInfo);
			this.getView().setModel(oJsonModel);
			
			if(!this.oPopOver){
				this.oPopOver = sap.ui.xmlfragment("com.ui5.echoit.temp.tables.sapMTable.FRAirLineInfo", this);
				this.getView().addDependent(this.oPopOver);
				this.oPopOver.bindElement("/");
			}
			
			this.oPopOver.openBy(oEvent.getSource());
		},
		
		// AirLine Code Popover의 Close 버튼
		onPressPopoverCloseBtn : function(){
			this.oPopOver.close();
		}
		
	});

});

