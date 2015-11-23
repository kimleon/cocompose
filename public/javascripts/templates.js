(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"homepage\">\r\n  <h1>CoCompose</h1>\r\n  <p>You must be signed in to continue.</p>\r\n  <button id=\"signin-btn\">Sign in</button>\r\n  <button id=\"register-btn\">Register</button>\r\n</div>\r\n";
},"useData":true});
templates['notes'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"notes\">\r\n 	<canvas id=\"piano\" width=\"150\" height=\"150\"></canvas>\r\n	<br>\r\n	<canvas id=\"sheet\" width=\"150\" height=\"150\"></canvas>\r\n	<button type=\"button\" id=\"playButton\">play/pause</button>\r\n\r\n	<br><br>\r\n</div>\r\n";
},"useData":true});
templates['register'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "      "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"register\">\r\n  <a href=\"#\" id=\"home-link\">Back to Home</a>\r\n  <h1>Register</h1>\r\n  <div class=\"error\">\r\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\r\n  <form id=\"register-form\">\r\n    <div>Username: <input type=\"text\" name=\"username\" required /></div>\r\n    <div>Password: <input type=\"password\" name=\"password\" required /></div>\r\n    <div>Confirm Password: <input type=\"password\" name=\"confirm\" required /></div>\r\n    <input type=\"submit\" />\r\n  </form>\r\n</div>\r\n";
},"useData":true});
templates['sheet'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"sheet\" data-sheet-id="
    + alias4(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"_id","hash":{},"data":data}) : helper)))
    + ">\r\n  <a href=\"#\" class=\"go-to-sheet\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a>\r\n</div>\r\n";
},"useData":true});
templates['sheets'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials.sheet,depth0,{"name":"sheet","data":data,"indent":"\t  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div id=\"sheets\">\r\n	<p>Welcome, "
    + container.escapeExpression(((helper = (helper = helpers.currentUser || (depth0 != null ? depth0.currentUser : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"currentUser","hash":{},"data":data}) : helper)))
    + " (<a href=\"#\" id=\"logout-link\">logout</a>)</p>\r\n	<h1>CoCompose</h1>\r\n	<div>\r\n      <div class=\"error\"></div>\r\n      <label for=\"new-sheet-input\">Add a new sheet:</label>\r\n      <input type=\"text\" id=\"new-sheet-input\" />\r\n      <button id=\"submit-new-sheet\">Add</button>\r\n    </div>\r\n	<h1>My Sheets</h1>\r\n\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.sheets : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\r\n";
},"usePartial":true,"useData":true});
templates['signin'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "      "
    + container.escapeExpression(((helper = (helper = helpers.error || (depth0 != null ? depth0.error : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"error","hash":{},"data":data}) : helper)))
    + "\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div id=\"signin\">\r\n  <a href=\"#\" id=\"home-link\">Back to Home</a>\r\n  <h1>Sign in</h1>\r\n  <div class=\"error\">\r\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.error : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\r\n  <form id=\"signin-form\">\r\n    <div>Username: <input type=\"text\" name=\"username\" required /></div>\r\n    <div>Password: <input type=\"password\" name=\"password\" required /></div>\r\n    <input type=\"submit\" />\r\n  </form>\r\n</div>\r\n";
},"useData":true});
})();