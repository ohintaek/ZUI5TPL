sap.ui.define([
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageBox"
	], function (ODataModel, MessageBox) {
		"use strict";

		var CommonUtil = {
			// Service Url for gateway connection.
			getOdataServiceUrl : function() {
			  //for local testing prefix with proxy
			  //if you and your team use a special host name or IP like 127.0.0.1 for localhost please adapt the if statement below 
			  var sServiceUrl = "http/ECHOSAP1.echoit.co.kr:8010" + jQuery.sap.getModulePath("odataservice", "/");
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
		}
	};
		return CommonUtil;
});