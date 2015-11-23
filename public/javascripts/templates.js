(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['index'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"homepage\">\r\n  <h1>CoCompose</h1>\r\n  <p>You must be signed in to continue.</p>\r\n  <button id=\"signin-btn\">Sign in</button>\r\n  <button id=\"register-btn\">Register</button>\r\n</div>\r\n";
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
    return "<div id=\"sheet\">\r\n  <h1>CoCompose</h1>\r\n  <p>Sheet/note UI here?</p>\r\n</div>\r\n";
},"useData":true});
templates['sheets'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"sheet\">\r\n  <h1>CoCompose</h1>\r\n  <p>Sheet/note UI here?</p>\r\n</div>\r\n";
},"useData":true});
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