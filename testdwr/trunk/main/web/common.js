
var common = {
  getContextPath: function() {
    return window.location.pathname.match(/^\/[^\/?#;]+/)[0];
  }	
};
