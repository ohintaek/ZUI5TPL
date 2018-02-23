sap.ui.define([
	"sap/ui/model/odata/ODataModel",
	], function (ODataModel) {
		"use strict";

		var CommonUtil = {
			
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
		
		// Gateway를 호출하는 Function
		getGatewayReadData : function(oFilter, sEntitySetName){
			var oModel = new ODataModel(this.getOdataServiceUrl(), true);
			
			var sResult;
			oModel.read(sEntitySetName,{
				filters : oFilter,
				async	: false,
				success : function(oData, oResponse) { sResult = oData.results; },
				error	: function(oError) { sap.m.MessageBox.error(oError.response.body, { title : "Error" }); }
			});
			
			return sResult;
		},
	};
		return CommonUtil;
});