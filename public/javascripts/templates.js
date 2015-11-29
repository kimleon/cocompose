(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "\n<div class=\"container\">\n  	<div class=\"page-header\">\n	  	<h1>CoCompose</h1>\n	</div>\n	  	<p>You must be signed in to continue.</p>\n		<button id=\"signin-btn\" class='btn btn-info'>Sign in</button>\n		<button id=\"register-btn\" class='btn btn-info'>Register</button>\n</div>\n";
},"useData":true});
templates['register'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n\n<div class=\"container\">\n    <div class=\"page-header\">\n      <h1>CoCompose</h1>\n    </div>\n    <a href=\"#\" id=\"home-link\">Back to Home</a>\n    <h1>Register</h1>\n    <div class=\"error\">\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <form id=\"register-form\" class=\"form-group\">\n      <div>Username: <input type=\"text\" name=\"username\" class=\"form-control\" placeholder=\"Username\" required /></div> <br>\n      <div>Password: <input type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" required /></div> <br>\n      <div>Confirm Password: <input type=\"password\" name=\"confirm\" class=\"form-control\" placeholder=\"Password\" required /></div>\n      <br>\n      <input type=\"submit\" class=\"btn btn-info\"/>\n    </form>\n</div>\n";
},"useData":true});
templates['sheet'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=container.escapeExpression;

  return "<div class=\"sheet\" data-sheet-id="
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n  <a href=\"./sheets/"
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\" class=\"go-to-sheet\">"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a><button class=\"delete-sheet\"><i class=\"fa fa-trash fa-lg\"></i></button>\n</div>\n";
},"useData":true});
templates['sheets'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.sheet,depth0,{"name":"sheet","data":data,"indent":"\t\t\t  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "			  <br>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"container\">\n  	<div class=\"page-header\">\n	<p>Welcome, "
    + container.escapeExpression(((helper = (helper = helpers.currentUser || (depth0 != null ? depth0.currentUser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"currentUser","hash":{},"data":data}) : helper)))
    + " (<a href=\"#\" id=\"logout-link\">logout</a>)</p>\n	<h1>CoCompose Music Library</h1>\n	<div class=\"error\"></div>\n	<form class=\"form-horizontal\" role=\"form\">\n        <div class=\"form-group\">\n            <label for=\"new-sheet-input\" class=\"col-sm-2 control-label\">Add a new sheet:</label>\n            <div class=\"col-sm-4\">\n                <input type=\"text\" class=\"form-control\" id=\"new-sheet-input\" placeholder=\"Sheet Name\">\n            </div>\n            <div class=\"col-sm-2\">\n            	<button id=\"submit-new-sheet\" class='btn btn-info'>Add</button>\n            </div>\n        </div>\n    </form>\n	<!-- <div class=\"row\"> -->\n\n      <!-- <div class=\"form-group col-md-6\">\n\n	  	<label for=\"new-sheet-input\">Add a new sheet:</label>\n      	<input type=\"text\" id=\"new-sheet-input\" class=\"form-control\"/>\n      </div>\n      <div class=\"col-md-6\">\n      	<button id=\"submit-new-sheet\" class='btn btn-info'>Add</button>\n      </div> -->\n    <div class=\"row\">\n        <div class=\"col-md-6\">\n			<h1>My Sheets</h1>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.own_sheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n        <div class=\"col-md-6\">\n			<h1>Sheets Shared With Me</h1>\n\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.collab_sheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n      </div>\n	</div>\n</div>\n";
},"usePartial":true,"useData":true});
templates['signin'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "        "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"error","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "\n<div class=\"container\">\n    <div class=\"page-header\">\n      <h1>CoCompose</h1>\n    </div>\n    <a href=\"#\" id=\"home-link\">Back to Home</a>\n    <h1>Sign In</h1>\n    <div class=\"error\">\n"
    + ((stack1 = helpers["if"].call(depth0,(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n    <form id=\"signin-form\" class=\"form-group\">\n      <div>Username: <input type=\"text\" name=\"username\" class=\"form-control\" placeholder=\"Username\" required /></div> <br>\n      <div>Password: <input type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Password\" required /></div>\n      <br>\n      <input type=\"submit\" class=\"btn btn-info\"/>\n    </form>\n</div>\n\n";
},"useData":true});
})();