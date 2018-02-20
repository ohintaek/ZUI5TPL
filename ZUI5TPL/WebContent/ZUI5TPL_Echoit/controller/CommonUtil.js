sap.ui.define([
	], function () {
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
		}
	};
		return CommonUtil;
});