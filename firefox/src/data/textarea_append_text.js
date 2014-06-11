var textarea = document.getElementById("fBody");
var important_params = ["fCID", "fMGID", "fMGSUBID"];

self.port.on("scriptAttached", function(obj){
  var important_param_value_pairs = getImportantParamValues();
  var paramsToMatch = [];

  if (obj.inboxIds.indexOf(important_param_value_pairs["fCID"] + '') == -1) return;

  var param;
  for (var i in important_params) {
    param = important_params[i];
    paramsToMatch[i] = "\\{\\{" + param + "\\}\\}";
  }

  text = obj.customMessage.replace(RegExp(paramsToMatch.join("|"), "g"), function(match, tag, str) {
    return important_param_value_pairs[match.replace(/\{\{|\}\}/g, '')];
  })
  textarea.value += text;
});

function getImportantParamValues() {
  var output = {};

  for (var i in important_params) {
    output[important_params[i]] = getJsonParams()[important_params[i]];
  }
  return output;
}

function getJsonParams() {
  var query = window.location.search.substring(1);
  var decode = function(str) { return decodeURIComponent(str.replace(/\+/g, " ")) };
  var json_query = {};
  var key_value_arr;
  for (var i in query.split("&")) {
    key_value_arr = query.split("&")[i].split("=");
    json_query[decode(key_value_arr[0])] = decode(key_value_arr[1]);
  }
  return json_query;
}