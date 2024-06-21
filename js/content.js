console.log("Content script loaded");

var BfsApiName = BfsApiName || {};

var DeveloperNameInputElement = DeveloperNameInputElement || {};
DeveloperNameInputElement.setName = function(d, c, g) {
  chrome.storage.sync.get(['namingConvention', 'prefix'], function(data) {
    const namingConvention = data.namingConvention || 'camelCase';
    const prefix = data.prefix || '';
    d = d.value.trim();
    if (d.length === 0) return;

    let words = d.split(/\s+/);
    let formattedName;

    if (namingConvention === 'camelCase' || namingConvention === 'pascalCase') {
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue');
      }

      if (namingConvention === 'camelCase') {
        formattedName = words[0].toLowerCase();
        for (let i = 1; i < words.length; i++) {
          formattedName += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        }
      } else {
        formattedName = '';
        for (let i = 0; i < words.length; i++) {
          formattedName += words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
        }
      }
    } else if (namingConvention === 'noChange') {
      return;
    } else {
      formattedName = d.replace(/\s+/g, '_');
    }

    c.value = prefix + formattedName;
    console.log("Updated API name to:", c.value);
  });
  return !0;
};

BfsApiName.init = function() {
  console.log("BfsApiName init called");

  var masterLabelInput = document.querySelector('input#MasterLabel');
  var developerNameInput = document.querySelector('input#DeveloperName');
  var nameInput = document.querySelector('input#Name');

  console.log("MasterLabel input found:", masterLabelInput);
  console.log("DeveloperName input found:", developerNameInput);
  console.log("Name input found:", nameInput);

  if (!masterLabelInput || (!developerNameInput && !nameInput) ||
      (developerNameInput && developerNameInput.disabled) ||
      (nameInput && nameInput.disabled)) {
    console.log("Required input fields are not found or are disabled");
    return;
  }

  console.log("Adding event listener to MasterLabel input");
  masterLabelInput.addEventListener('blur', function() {
    console.log("MasterLabel blur event triggered");
    if (developerNameInput) {
      console.log("Updating DeveloperName input");
      DeveloperNameInputElement.setName(this, developerNameInput, 'Field1');
      console.log("Updated DeveloperName:", developerNameInput.value);
    } else if (nameInput) {
      console.log("Updating Name input");
      DeveloperNameInputElement.setName(this, nameInput, 'Field1');
      console.log("Updated Name:", nameInput.value);
    }
  });
};

BfsApiName.init();