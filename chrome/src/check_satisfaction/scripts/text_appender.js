console.log("Start Working!");

var params_important = ["fCID", "fMGID", "fMGSUBID"];


function retrieve_data(){
  var form = document.getElementById("MailForm");
  var array_params = get_params_array();

  if(form){
    chrome.storage.local.get(CONSTANTS.TEXT_APPEND_LABEL, function(item){
      var setting = item.append_setting;
      console.log(array_params["fCID"]);
      if(setting && setting.mailbox_ids.split(",").indexOf(array_params["fCID"].toString()) >= 0){
        form.fBody.value += replace_string_from_params(setting.append_string, array_params);
      }
    });
  }
}

function get_params_array(){
  var vars = window.location.search.substring(1).split("&");
  var array_params = {};
  
  for (var i = 0 ; i < vars.length ; i++) {
    var pair = vars[i].split("=");
    if(pair.length == 2){
      array_params[decodeURI(pair[0])] = decodeURI(pair[1]);
    }
  }

  return array_params;
}

function replace_string_from_params(str_source, hash_array){
  
  
  for(var i = 0; i < params_important.length; i++){
    if(hash_array[params_important[i]]){
      str_source = str_source.replace( new RegExp("{{" + params_important[i] + "}}","gm"), hash_array[params_important[i]]);
    }
  }
  
  return str_source;
}

retrieve_data();