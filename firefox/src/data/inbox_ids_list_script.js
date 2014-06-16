var textarea = document.getElementById("input");
var submitButton = document.getElementById("submit");
var removeButton = document.getElementById("remove");
var idList = document.getElementById("inbox-id-list");
var statusLabel = document.getElementById("status");

self.port.on("panelShow", function(inboxIds) {
  idList.innerHTML = createList(inboxIds);
});

self.port.on("idSaved", function(inboxIds) {
  idList.innerHTML = createList(inboxIds);
});

self.port.on("idAlreadyExists", function(message) {
  statusLabel.innerHTML = message;
});

self.port.on("idsRemoved", function(inboxIds){
  idList.innerHTML = createList(inboxIds);
})

submitButton.addEventListener("click", function() {
  if (textarea.value.match(/[^0-9]/g) != null) {
    statusLabel.innerHTML = "Input must not contain letters, spaces and special characters";
  } else if(!textarea.value) {
    statusLabel.innerHTML = "Input must not be empty";
  } else {
    self.port.emit("saveButtonClicked", textarea.value);
    clearTexts();
  }
});

removeButton.addEventListener("click", function() {
  self.port.emit("removeButtonClicked", getSelectedOptionValues(idList));
  clearTexts();
});

function createList(inboxIds) {
  if (typeof inboxIds == "undefined" || inboxIds.length <= 0) return '';
  var return_str = '';
  var id;
  for (var i in inboxIds) {
    id = inboxIds[i];
    return_str += '<option value="'+ id +'">'+ id +'</option>';
  }
  return return_str;
};

function getSelectedOptionValues(select) {
  var result = [];
  var options = select && select.options;
  var option;

  for (var i in options) {
    option = options[i];

    if (option.selected) {
      result.push(option.value || option.text);
    }
  }
  return result;
}

function clearTexts() {
  statusLabel.innerHTML = "";
  textarea.value = "";
}