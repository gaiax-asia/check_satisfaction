var textarea = document.getElementById("custom-message");
var statusText = document.getElementById("status");
var submitButton = document.getElementById("submit");
var cancelButton = document.getElementById("cancel");

self.port.on("panelShow", function(text) {
  textarea.value = text;
});

self.port.on("panelHide", function(text) {
  statusText.innerHTML = "";
});

submitButton.addEventListener("click", function() {
  self.port.emit("saveButtonClicked", textarea.value);
  statusText.innerHTML = "Saved!";
}, false);

cancelButton.addEventListener("click", function() {
  self.port.emit("cancelButtonClicked");
}, false);