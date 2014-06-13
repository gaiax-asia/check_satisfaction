document.addEventListener("DOMContentLoaded", function(event) {
  translate();
});

function translate(){
  var elements = document.querySelectorAll("[data-translate]");
  
  for(var i = 0; i < elements.length; i++){
    var code = elements[i].getAttribute("data-translate");
    var translation = chrome.i18n.getMessage(code);
    if(translation.trim() != ""){
      if(elements[i].textContent){
        elements[i].textContent = translation;
      } else if(elements[i].text){
        elements[i].text = translation;
      } else {
        elements[i].value = translation;
      }
    }
  }
}

function get_translation(code){
  return chrome.i18n.getMessage(code);
}