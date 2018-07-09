sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History"
	], function (Controller, History) {
		"use strict";

		return Controller.extend("com.ui5.echoit.controller.BaseController", {

			/**
			 * Convenience method for accessing the router.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},

			/**
			 * Convenience method for getting the view model by name.
			 * @public
			 * @param {string} [sName] the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},
			
			onNavBack: function() {
				var oHistory = History.getInstance();
				
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined){	
					window.history.go(-1);
				} else {
					this.getRouter().navTo("Home");
				}
			},
			
			getOdataServiceUrl : function() {
				  //for local testing prefix with proxy
				  //if you and your team use a special host name or IP like 127.0.0.1 for localhost please adapt the if statement below 
				  var sServiceUrl = "http/echosap1.echoit.co.kr:8010" + jQuery.sap.getModulePath("odataservice", "/");
				  if (window.location.hostname == "localhost") {
				      return "proxy/" + sServiceUrl;
				  } else {
				      return sServiceUrl;
				  }
			}
		});
	});