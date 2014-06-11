function save_append_setting(form){
  var append_string = CONSTANTS.TEXT_APPEND;

  if(form.enabled.value == CONSTANTS.ON){
    append_string = form.append_string.value;
  }

  var item = { type: CONSTANTS.SETTINGS, id: CONSTANTS.TEXT_APPEND_LABEL, append_string: append_string, enabled: form.enabled.value, mailbox_ids: form.mailbox_ids.value.trim() }

  chrome.storage.local.set({append_setting: item});
}

function set_append_settings(){
  var form = document.getElementById("append_setting_form");
  
  form.reset();
  
  chrome.storage.local.get(CONSTANTS.TEXT_APPEND_LABEL, function(item){
    append_setting = item.append_setting;
    if(append_setting){
      for(key in append_setting){
        if(form_item = form[key]){
          form_item.value = append_setting[key];
        }
      }
    }else{
      form.enabled.value = CONSTANTS.OFF;
    }
    document.getElementById("text-string-div").style.display = (form.enabled.value == CONSTANTS.ON) ? '' : 'none';
  });
}

function toggle(element){
  document.getElementById("text-string-div").style.display = (element.value == CONSTANTS.ON) ? '' : 'none';
}

document.addEventListener("DOMContentLoaded", function(event) {

  set_append_settings();

  document.getElementById("append_setting_form").onsubmit = function(){
    save_append_setting(this);
    return false;
  }

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var change = changes[key];
      if( change.oldValue && change.newValue && change.oldValue != change.newValue ){
        alert("Changes Saved!");
      }else if( !change.oldValue && change.newValue ){
        alert("Saved!");
      }else if( change.oldValue && !change.newValue ){
        alert("Settings deleted");
      }
      
      set_append_settings();
    }
  });
  
  radio_buttons = document.getElementsByName("enabled");
  for(var i = 0; i < radio_buttons.length; i++){
    radio_buttons[i].onclick = function(){
      toggle(this);
    } 
  }
});
