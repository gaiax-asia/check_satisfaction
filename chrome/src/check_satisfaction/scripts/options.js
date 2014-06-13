function save_append_setting(form){
  var append_string = CONSTANTS.TEXT_APPEND;

  if(form.enabled.value == CONSTANTS.ON){
    append_string = form.append_string.value;
  }

  var item = { type: CONSTANTS.SETTINGS, id: CONSTANTS.TEXT_APPEND_LABEL, append_string: append_string, enabled: form.enabled.value, mailbox_ids: get_all_values().join() }

  chrome.storage.local.set({append_setting: item});
}

function set_append_settings(){
  var form = document.getElementById("append_setting_form");
  
  form.reset();
  
  chrome.storage.local.get(CONSTANTS.TEXT_APPEND_LABEL, function(item){
    append_setting = item.append_setting;
    if(append_setting){
      for(key in append_setting){
        if((form_item = form[key]) && key != "mailbox_ids"){
          form_item.value = append_setting[key];
        }
      }
      if(append_setting.mailbox_ids){
        set_mailbox_ids(append_setting.mailbox_ids.split(","));
      }
      
    }else{
      form.enabled.value = CONSTANTS.OFF;
    }
    document.getElementById("text-string-div").style.display = (form.enabled.value == CONSTANTS.ON) ? '' : 'none';
  });
}

function toggle(params){
  if(!params.operation) params.operation = '==';
  document.getElementById(params.id).style.display = compare[params.operation](params.comparator, params.against) ? '' : 'none';
}

function add_item(){
  var input = document.getElementById("mailbox-id");
  var select = document.getElementById("mailbox-ids");
  var item = document.createElement("OPTION");
  var id = input.value.trim();
  
  if(id && (get_all_values().indexOf(id) < 0) && parseInt(id)){
    item.value = id;
    item.appendChild(document.createTextNode(id));
    select.appendChild(item);
  }

  input.value = "";
  input.focus();
}

function remove_items(){
  var select = document.getElementById("mailbox-ids");
  selected_items = select.selectedOptions
  
  for (var i = select.length - 1; i >= 0 ; i--) {
    if (select.options[i].selected) {
      select.remove(i);
    }
  }
}

function select_all_items(){
  var select = document.getElementById("mailbox-ids");
  for (var i = 0; i < select.options.length; i++) { 
    select.options[i].selected = true;
  } 
}

function get_all_values(){
  var values = new Array();
  var select = document.getElementById("mailbox-ids");
  for (var i = 0; i < select.options.length; i++) { 
    values.push(select.options[i].value.trim());
  }
  
  return values;
}

function get_selected_values(){
  var selected_values = new Array();
  var select = document.getElementById("mailbox-ids");
  for (var i = 0; i < select.options.length; i++) { 
    if(select.options[i].selected){
      selected_values.push(select.options[i].value.trim())
    }
  }
  return selected_values;
}

function set_mailbox_ids(items){
  var select = document.getElementById("mailbox-ids");
  select_all_items();
  remove_items();
  for(var i in items){
    var id = items[i];
    var item = document.createElement("OPTION");
  
    item.value = id;
    item.appendChild(document.createTextNode(id));
    select.appendChild(item);
  }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", function(event) {

  set_append_settings();

  document.getElementById("append_setting_form").onsubmit = function(){
    save_append_setting(this);
    return false;
  }
  
  document.getElementById("add-link").onclick = function(){
    add_item();
    return false;
  }
  
  document.getElementById("remove-link").onclick = function(){
    remove_items();
    return false;
  }
  
  document.getElementById("mailbox-id").onkeypress = function(event){
    var is_number = isNumber(event);
    toggle({id: "add-link", against: true, comparator: (is_number || ( !is_number && this.value.trim() != "")) });
    return is_number;
  }
  
  document.getElementById("mailbox-ids").onclick = function(event){
    toggle({id: "remove-link", against: 0, comparator: this.selectedOptions.length, operation: ">" });
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
      toggle({id: "text-string-div", against: CONSTANTS.ON, comparator: this.value });
    } 
  }
  
  document.getElementById("remove-link").style.display = 'none';
  document.getElementById("add-link").style.display = 'none';
});
