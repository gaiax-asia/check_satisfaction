var sp = require("sdk/simple-prefs");
var ss = require("sdk/simple-storage");
var prefs = sp.prefs;
var { data } = require("sdk/self");
var pageMod = require("sdk/page-mod");
var _ = require("sdk/l10n").get;
var helpers = require("./helpers.js");
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

// ============ Events ============

sp.on("openCustomMessagePanel", function() {
  customMessagePanel.show();
});

customMessagePanel.on("show", function() {
  customMessagePanel.port.emit("panelShow", prefs.customMessage);
});

customMessagePanel.on("hide", function() {
  customMessagePanel.port.emit("panelHide");
});

customMessagePanel.port.on("saveButtonClicked", function(text) {
  prefs.customMessage = text;
  customMessagePanel.port.emit("messageSaved", _("saved_id"));
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

inboxIdsListPanel.port.on("saveButtonClicked", function(inbox_id) {
  if (inbox_id.match(/[^0-9]/g) != null) {
    inboxIdsListPanel.port.emit("validationError", _("validation_numeric_only_id"));
  } else if(!inbox_id) {
    inboxIdsListPanel.port.emit("validationError", _("validation_must_not_be_blank"));
  } else {
    if (ss.storage.inboxIds.indexOf(inbox_id) == -1) {
      ss.storage.inboxIds.push(inbox_id);
      inboxIdsListPanel.port.emit("idSaved", ss.storage.inboxIds);
    } else {
      inboxIdsListPanel.port.emit("validationError", _("validation_id_already_exists"));
    }
  }
})

inboxIdsListPanel.port.on("removeButtonClicked", function(idsToDelete) {
  if (idsToDelete.length > 0) {
    ss.storage.inboxIds = helpers.array_diff(ss.storage.inboxIds, idsToDelete);
    inboxIdsListPanel.port.emit("idsRemoved", ss.storage.inboxIds);
  }
})

// Events - End

// 'textarea_append_text.js' will only be attached if this matches /https:\/\/maildealer\.gaiax\.com\/replyMail.*/ pattern.
pageMod.PageMod({
  include: /https:\/\/maildealer\.gaiax\.com\/replyMail.*/,
  contentScriptFile: [data.url("textarea_append_text.js")],
  onAttach: function(worker) {
    if (helpers.autoAppend.enabled()) {
      worker.port.emit("scriptAttached", {customMessage: prefs.customMessage, inboxIds: ss.storage.inboxIds});
    }
  }
});

exports.main = function(options) {
  ss.storage.inboxIds = typeof ss.storage.inboxIds == "undefined" ? [] : ss.storage.inboxIds
}

exports.onUnload = function(reason) {
  if (reason == "disable") {
    helpers.resetPref('customMessage');
    helpers.resetPref('autoAppendMessage');
    delete ss.storage.inboxIds;
  }
}