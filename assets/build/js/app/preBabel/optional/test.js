;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['uuid-gen'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('uuid-gen'));
  } else {
    root.dcfWidgetNotice = factory(root.dcf-helper-uuidv4);
  }
}(this, function(uuidv4) {
function apple() {
	return false;
}

apple();

return Test;
}));
