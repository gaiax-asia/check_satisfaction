var sp = require("sdk/simple-prefs");
var ss = require("sdk/simple-storage");
var prefs = sp.prefs;
var { data } = require("sdk/self");
var pageMod = require("sdk/page-mod");
var toggleButton = require("sdk/ui/button/toggle");
var windows = require("sdk/windows").browserWindows;
var customMessagePanel = require("sdk/panel").Panel({
  width: 500,
  height: 300,
  contentURL: data.url("custom_message_panel.html"),
  contentScriptFile: [data.url("custom_message_script.js")]
})
var inboxIdsListPanel = require("sdk/panel").Panel({
  width: 300,
  height: 400,
  contentURL: data.url("inbox_ids_list_panel.html"),
  contentScriptFile: [data.url("inbox_ids_list_script.js")]
})

// ============ Functions ============ 
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

//function autoAppendToggleInit() {
//  toggleAutoAppend.state("window", {checked: autoAppend.enabled()});
//};
// Functions - End
// ============ Events ============

sp.on("openCustomMessagePanel", function() {
  customMessagePanel.show();
});

//sp.on("autoAppendMessage", function(evt_name) {
//  autoAppendToggleInit();
//})

customMessagePanel.on("show", function() {
  customMessagePanel.port.emit("panelShow", prefs.customMessage);
});

customMessagePanel.on("hide", function() {
  customMessagePanel.port.emit("panelHide");
});

customMessagePanel.port.on("saveButtonClicked", function(text) {
  prefs.customMessage = text;
});

customMessagePanel.port.on("cancelButtonClicked", function() {
  customMessagePanel.hide();
});

sp.on("openInboxIdList", function() {
  inboxIdsListPanel.show();
})

inboxIdsListPanel.on("show", function() {
  inboxIdsListPanel.port.emit("panelShow", ss.storage.inboxIds);
})

ss.storage.inboxIds = typeof ss.storage.inboxIds == "undefined" ? [] : ss.storage.inboxIds

inboxIdsListPanel.port.on("saveButtonClicked", function(inbox_id) {
  if (ss.storage.inboxIds.indexOf(inbox_id) == -1) {
    ss.storage.inboxIds.push(inbox_id);
    inboxIdsListPanel.port.emit("idSaved", ss.storage.inboxIds);
  } else {
    inboxIdsListPanel.port.emit("idAlreadyExists", "ID already exists");
  }
})

Array.prototype.diff = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};

inboxIdsListPanel.port.on("removeButtonClicked", function(idsToDelete) {
  if (idsToDelete.length > 0) {
    ss.storage.inboxIds = ss.storage.inboxIds.diff(idsToDelete);
    inboxIdsListPanel.port.emit("idsRemoved", ss.storage.inboxIds);
  }
})

// Events - End

// 'textarea_append_text.js' will only be attached if this matches /https:\/\/maildealer\.gaiax\.com\/replyMail.*/ pattern.
pageMod.PageMod({
  include: /https:\/\/maildealer\.gaiax\.com\/replyMail.*/,
  contentScriptFile: [data.url("textarea_append_text.js")],
  onAttach: function(worker) {
    if (autoAppend.enabled()) {
      worker.port.emit("scriptAttached", {customMessage: prefs.customMessage, inboxIds: ss.storage.inboxIds});
    }
  }
});

//var toggleAutoAppend = toggleButton.ToggleButton({
//  id: "toggleAutoAppend",
//  label: "Toggle Auto Append",
//  icon: "./icon-16.png",
//  onChange: function(state) {
//    autoAppend.enabled(state.checked);
//  }
//});
//
//windows.on("open", function() {
//  autoAppendToggleInit();
//});
//autoAppendToggleInit();