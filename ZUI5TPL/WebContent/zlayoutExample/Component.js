sap.ui.define([
   "sap/ui/core/UIComponent"
], function (UIComponent) {
   "use strict";
   return UIComponent.extend("echoit.zuitpl.layoutExample.Component", {

	   metadata: {
			manifest: "json"
		},

		
      init : function () {
         // call the init function of the parent
         UIComponent.prototype.init.apply(this, arguments);
 
         // create the views based on the url/hash
         this.getRouter().initialize();
      }
   });
});	