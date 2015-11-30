(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\r\n<div class=\"container\">\r\n  	<div class=\"page-header\">\r\n	  	<h1>CoCompose</h1>\r\n	</div>\r\n	  	<p>You must be signed in to continue.</p>\r\n		<button id=\"signin-btn\" class='btn btn-info'>Sign in</button>\r\n		<button id=\"register-btn\" class='btn btn-info'>Register</button>\r\n</div>\r\n";
},"useData":true});
templates['register'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\r\n\r\n<div class=\"container\">\r\n    <div class=\"page-header\">\r\n      <h1>CoCompose</h1>\r\n    </div>\r\n    <a href=\"#\" id=\"home-link\">Back to Home</a>\r\n    <h1>Register</h1>\r\n    <div class=\"error\">\r\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <form id=\"register-form\" class=\"form-group\">\r\n      <div>Username: <input type=\"text\" name=\"username\" class=\"form-control\" placeholder=\"Username\" required /></div> <br>\r\n      <div>Password: <input type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" required /></div> <br>\r\n      <div>Confirm Password: <input type=\"password\" name=\"confirm\" class=\"form-control\" placeholder=\"Password\" required /></div>\r\n      <br>\r\n      <input type=\"submit\" class=\"btn btn-info\"/>\r\n    </form>\r\n</div>\r\n";
},"useData":true});
templates['sheet'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"sheet\" data-sheet-id="
    + alias4(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + ">\r\n  <a href=\"./sheets/"
    + alias4(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\" class=\"go-to-sheet\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a><button class=\"delete-sheet\"><i class=\"fa fa-trash fa-lg\"></i></button>\r\n</div>\r\n";
},"useData":true});
templates['sheets'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.sheet,depth0,{"name":"sheet","data":data,"indent":"\t\t\t  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "			  <br>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"container\">\r\n  	<div class=\"page-header\">\r\n	<p>Welcome, "
    + container.escapeExpression(((helper = (helper = helpers.currentUser || (depth0 != null ? depth0.currentUser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"currentUser","hash":{},"data":data}) : helper)))
    + " (<a href=\"#\" id=\"logout-link\">logout</a>)</p>\r\n	<h1>CoCompose Music Library</h1>\r\n	<div class=\"error\"></div>\r\n	<form class=\"form-horizontal\" role=\"form\">\r\n        <div class=\"form-group\">\r\n            <label for=\"new-sheet-input\" class=\"col-sm-2 control-label\">Add a new sheet:</label>\r\n            <div class=\"col-sm-4\">\r\n                <input type=\"text\" class=\"form-control\" id=\"new-sheet-input\" placeholder=\"Sheet Name\">\r\n            </div>\r\n            <div class=\"col-sm-2\">\r\n            	<button id=\"submit-new-sheet\" class='btn btn-info'>Add</button>\r\n            </div>\r\n        </div>\r\n    </form>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-6\">\r\n			<h1>My Sheets</h1>\r\n\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.own_sheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n        <div class=\"col-md-6\">\r\n			<h1>Sheets Shared With Me</h1>\r\n\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collab_sheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n      </div>\r\n	</div>\r\n</div>\r\n";
},"usePartial":true,"useData":true});
templates['signin'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\r\n<div class=\"container\">\r\n    <div class=\"page-header\">\r\n      <h1>CoCompose</h1>\r\n    </div>\r\n    <a href=\"#\" id=\"home-link\">Back to Home</a>\r\n    <h1>Sign In</h1>\r\n    <div class=\"error\">\r\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <form id=\"signin-form\" class=\"form-group\">\r\n      <div>Username: <input type=\"text\" name=\"username\" class=\"form-control\" placeholder=\"Username\" required /></div> <br>\r\n      <div>Password: <input type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" required /></div>\r\n      <br>\r\n      <input type=\"submit\" class=\"btn btn-info\"/>\r\n    </form>\r\n</div>\r\n\r\n";
},"useData":true});
})();