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
			
			mousePositionOnMenu : false,
			onAfterRendering : function() {
				
				// 1. 메인 메뉴를 마우스 움직임에 따라 동작하도록 한다.
				$('.mainMenuPane > div > ul > li').each(function(index, oSrc) {
					$(this).mouseover(function(oEvent) {
						for(var i = 0; i < this.parentNode.children.length; i++){
							var liNode = this.parentNode.children[i];
								liNode.classList.remove('selectedMenu');
						}
						
						this.classList.add('selectedMenu');
					})
				})
				
				// 마우스가 메인메뉴 영역 안에 있거나 (클릭했을 경우) 마우스 위치가 메뉴위에 있음을 설정한다.
				$('.mainMenuPane').mouseover(function(e) {
					this.mousePositionOnMenu = true;
				}.bind(this));
				
				$('.mainMenuPane').click(function(e) {
					this.mousePositionOnMenu = true;
				}.bind(this));
				
				// 마우스가 메인메뉴 영역을 벗어났을 경우 마우스 위치가 메뉴위에 없음을 설정한다.
				$('.mainMenuPane').mouseout(function(e) {
					this.mousePositionOnMenu = false;
				}.bind(this));
				
				
				$('.mainMenuPaneBackground').click(function(e) {
					if(this.mousePositionOnMenu)
						return;
					
					// 메인메뉴를 안보이도록 접는다.
					this.collapseMainMenu();
				}.bind(this));
				
			},
			
			MenuDisplayStatus : false,
			onMenuButton : function(oEvent) {
				var mainMenuPaneBackground = $(".mainMenuPaneBackground");
				var menuButton = this.getView().byId("mainMenuButton");
				if(this.MenuDisplayStatus == false){
					mainMenuPaneBackground.fadeIn( 200 );
					menuButton.setIcon("sap-icon://decline");
				} else {
					mainMenuPaneBackground.fadeOut( 200 );
					menuButton.setIcon("sap-icon://menu");
				}
				
				this.MenuDisplayStatus = !this.MenuDisplayStatus;
			},
			
			// 메인메뉴를 안보이도록 접는다.
			collapseMainMenu : function() {
				this.MenuDisplayStatus = false;
				$('.mainMenuPaneBackground').fadeOut( 200 );
				this.getView().byId("mainMenuButton").setIcon("sap-icon://menu");
				
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