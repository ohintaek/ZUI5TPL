sap.ui.define([
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
	], function (ODataModel, JSONModel, MessageBox, MessageToast) {
		"use strict";

		var CommonUtil = {
		
		/*****************************************************************
		 * Gateway와 연결하기 위한 URL을 리턴한다.
		 *****************************************************************/
		// Service Url for gateway connection.
		getOdataServiceUrl : function() {
			//for local testing prefix with proxy
			//if you and your team use a special host name or IP like 127.0.0.1 for localhost please adapt the if statement below 
			var sServiceUrl = "http/echosap1.echoit.co.kr:8010" + jQuery.sap.getModulePath("odataservice", "/");
			if (window.location.hostname == "localhost") {
			    return "proxy/" + sServiceUrl;
			} else {
			    return sServiceUrl;
			}
		},
		
		// - Gateway의 Query (Query)를 호출하는 Function
		/*****************************************************************
		 * Parameter
		 * - sEntitySetName : Gateway Entity Set Name
		 * - oFilter : "sap.ui.model.Filter" Object type
		 *****************************************************************/
		getGatewayQueryData : function(oFilter, sEntitySetName){
			var oModel = new ODataModel(this.getOdataServiceUrl(), true);
			
			var sResult;
			oModel.read(sEntitySetName, {
				filters : oFilter,
				async	: false,
				success : function(oData, oResponse) { sResult = oData.results; },
				error	: function(oError) {
					sap.m.MessageBox.error(oError.response.body, { title : "Error" });
				}
			});
			
			return sResult;
		},
		
		// - Gateway의 Create Method를 호출하는 Function
		/*****************************************************************
		 * Parameter
		 * - sEntitySetName : Gateway Entity Set Name
		 * - gateway_parameter : Object type { Entity Property : value }
		 *****************************************************************/
		setGatewayCreateData : function(sEntitySetName, gateway_parameter){
			var oModel = new ODataModel(this.getOdataServiceUrl(), true);
			
			var sResult;
			oModel.create(sEntitySetName, gateway_parameter, {
				async : false,
				success : function(oData, oResponse) {sResult = oData;},
				error	: function(oError) {
					MessageBox.error(oError.response.body, { title : "Error" });
				}
			})
			
			return sResult;
		},
		
		// Function 설명
		// - Gateway의 Read Method를 호출하는 Function
		/*****************************************************************
		 * Parameter
		 * - sEntitySetName : Gateway Entity Set Name
		 * - aKeyValue : Array type [{ key of Entity Property : value }]
		 *****************************************************************/
		getGatewayReadData : function(sEntitySetName, aKeyValue){
			
			if(aKeyValue.length == 0)
				return;
			
			var sEntitySetName;
			for(var i = 0; i < aKeyValue.length; i++){
				if(i == 0)
					sEntitySetName += "(";
				
				sEntitySetName += aKeyValue[i].key + "="
				sEntitySetName += "'" + aKeyValue[i].value + "'";
				
				if(i == (aKeyValue.length - 1))
					sEntitySetName += ")";
				else
					sEntitySetName += ",";
			}
			var oModel = new ODataModel(this.getOdataServiceUrl(), true);
			
			var sResult;
			oModel.read(sEntitySetName, null, null, false,
				function(oData, oResponse){ sResult = oData;},
				function(oError){ MessageBox.error(oError.response.body, { title : "Error" });
            });
			
			return sResult;
		},
		
		// Function 설명
		// - Gateway의  Delete Method를 호출하는 Function
		/*****************************************************************
		 * Parameter
		 * - sEntitySetName : Gateway Entity Set Name
		 * - aKeyValue : Array type [{ key of Entity Property : value }]
		 *****************************************************************/
		getGatewayDeleteData : function(sEntitySetName, aKeyValue){
			
			if(aKeyValue.length == 0)
				return;
			
			var sEntitySetName;
			for(var i = 0; i < aKeyValue.length; i++){
				if(i == 0)
					sEntitySetName += "(";
				
				sEntitySetName += aKeyValue[i].key + "="
				sEntitySetName += "'" + aKeyValue[i].value + "'";
				
				if(i == (aKeyValue.length - 1))
					sEntitySetName += ")";
				else
					sEntitySetName += ",";
			}
			var oModel = new ODataModel(this.getOdataServiceUrl(), true);
			
			var sResult;
			oModel.remove(sEntitySetName, null, null, false,
				function(oData, oResponse){ sResult = oData;},
				function(oError){ MessageBox.error(oError.response.body, { title : "Error" });
            });
			
			return sResult;
		},
		
		// Message Toast common function
		showMessage : function(Message){
			MessageToast.show(Message);
		},
		
		// Function 설명
		// - sap.m.uploadcollection (파일 첨부)
		/*****************************************************************
		 * Parameter
		 * oEvent : UploadCollection Event Object
		 *****************************************************************/
		onChange : function(oEvent) {
			try {
				var oModel = new ODataModel(this.getOdataServiceUrl(), false);
				
				var oFileUpload = oEvent.getSource();
					oFileUpload.setUploadUrl(oModel.sServiceUrl + "/ZUI5TPL_FILESet");
				
				oModel.refreshSecurityToken();
				
				var oHeader = new sap.m.UploadCollectionParameter({
					name : 'x-csrf-token',
					value : oModel.getHeaders()['x-csrf-token']
				});
				
				oFileUpload.addHeaderParameter(oHeader);
				
			} catch(ex) {
				this.showMessage(ex);
			}
		},
		
		onBeforeUploadStarts : function(oEvent) {
			try {
				 
				var oFileInfo = {
						doknm : encodeURI(oEvent.getParameters("fileName").fileName),
						dokar : "ZUI",
						doktl : "000",
						dokvr : "-" 
				}
				

				var slugValue = JSON.stringify(oFileInfo);
				var oHeader = new sap.m.UploadCollectionParameter({
					name : "slug",
					value : encodeURIComponent(slugValue)
				});

				var oModel = new ODataModel(this.getOdataServiceUrl(), false);
				
				var oFileUpload = oEvent.getSource();
					oFileUpload.setUploadUrl(oModel.sServiceUrl + "/ZUI5TPL_FILESet");
				
				oEvent.getParameters().addHeaderParameter(oHeader);
					
			} catch(ex) {
				this.showMessage(ex);
			}
		},
		
		onUploadComplete : function(oEvent){
			var oFileUpload = oEvent.getSource();
			
			var sResponse = oEvent.getParameters().getParameter("response");
			var oDocInfo = this.getResponse(sResponse);
			
			var aFiles = [];
				aFiles.push(oDocInfo);
			
			var oFileModel = new JSONModel();
				oFileModel.setData({ files : aFiles });
				
				oFileUpload.setModel(oFileModel);
				oFileUpload.bindItems({
					path : "/files",
					template :
						new sap.m.UploadCollectionItem({
							documentId : "{DOKNR}",
							fileName   : "{DOKNM}",
							url		   : "{URL}",
							visibleEdit: false,
							attributes : [
								new sap.m.ObjectAttribute({
									title : "File Size",
									text  : "{DOSIZ} bytes"
								})
							]
						})
				})
			
		},
		
		getResponse : function(sResponse){
			var aResponse = sResponse.split("{")[1];
			var sDoc = "{" + aResponse;
			var aDocInfo = JSON.parse(sDoc);
			
			var sUrl = sResponse.split(")")[0];
			aDocInfo.URL = sUrl + ")/$value";
			
			return aDocInfo;
		}
	};
		return CommonUtil;
});