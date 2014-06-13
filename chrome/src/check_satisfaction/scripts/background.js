chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(CONSTANTS.TEXT_APPEND_LABEL, function(item){
    append_setting = item.append_setting;
    if(!append_setting){
      chrome.storage.local.set({append_setting: { type: CONSTANTS.SETTINGS, id: CONSTANTS.TEXT_APPEND_LABEL, append_string: CONSTANTS.TEXT_APPEND, enabled: CONSTANTS.OFF }});
    }
  });
})