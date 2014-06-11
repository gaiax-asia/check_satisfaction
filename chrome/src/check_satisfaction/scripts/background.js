chrome.runtime.onInstalled.addListener(function() {
  //Save Default Data:
  chrome.storage.local.get(CONSTANTS.TEXT_APPEND_LABEL, function(item){
    console.log(item);
    append_setting = item.append_setting;
    if(!append_setting){
      chrome.storage.local.set({append_setting: { type: CONSTANTS.SETTINGS, id: CONSTANTS.TEXT_APPEND_LABEL, append_string: CONSTANTS.TEXT_APPEND, enabled: CONSTANTS.OFF }});
    }
  });
})