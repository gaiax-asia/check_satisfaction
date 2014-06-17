var autoAppend = {
  enabled: function(bool) {
    if (typeof bool != "undefined") {
      prefs.autoAppendMessage = {true: "append", false: "dontAppend"}[bool];
      return prefs.autoAppendMessage
    } else {
      return prefs.autoAppendMessage == "append"
    }
  }
};

var array_diff = function(array1, array2) {
  return array1.filter(function(i) {return array2.indexOf(i) < 0;})
}

function resetPref(prefName) {
  require('sdk/preferences/service').reset(['extensions', require('sdk/self').id, prefName].join('.'));
}

exports.autoAppend = autoAppend;
exports.array_diff = array_diff;
exports.resetPref  = resetPref;