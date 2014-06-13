var CONSTANTS = Object.freeze({
  OFF: 0,
  ON: 1,
  SETTINGS: 100,
  TEXT_APPEND_LABEL: "append_setting",
  TEXT_APPEND: "Mailbox ID: {{fCID}} \r\nMessage ID: {{fMGID}} \r\nMessage Response Number: {{fMGSUBID}}\r\n",
  CHANGES_SAVED: "changes_saved",
  SAVED: "saved",
  SETTINGS_DEL: "settings_deleted"
});

var compare = {
  '==':   function(a, b) { return a == b },
  '===':  function(a, b) { return a === b },
  '!=':   function(a, b) { return a != b },
  '!==':  function(a, b) { return a !== b },
  '>':    function(a, b) { return a > b },
  '>=':   function(a, b) { return a >= b },
  '<':    function(a, b) { return a < b },
  '<=':   function(a, b) { return a <= b }
};