chrome.tabs.query(
  {
    active : true,
    currentWindow : true
  },
  function(tab) {
    var newTabIndex = tab[0].index + 1;
    var sourceUrlEncoded = encodeURIComponent(tab[0].url);
    // http request documentation - https://developer.chrome.com/extensions/xhr
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://script.google.com/a/google.com/macros/s/AKfycbx9VSTxeae5gCWMMKXHdWYpMNzRTSg4J8LkJdn5ScuNv7UEWYWH/exec?source=" + sourceUrlEncoded, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        var checklistUrl = xhr.responseText;
        chrome.tabs.create(
          {
            index : newTabIndex,
            url : checklistUrl
          },
          function(tab) {}
        );
      }
    }
    xhr.send();
  }
);