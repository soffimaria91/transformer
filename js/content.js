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

// New function to check if we're dealing with a new item (field or object)
function isNewItem(nameInput) {
  return nameInput && nameInput.value.trim() === '';
}

BfsApiName.init = function() {
  console.log("BfsApiName init called");

  // For fields
  var fieldMasterLabelInput = document.querySelector('input#MasterLabel');
  var fieldDeveloperNameInput = document.querySelector('input#DeveloperName');
  var fieldNameInput = document.querySelector('input#Name');

  // For objects
  var objectLabelInput = document.querySelector('input#MasterLabel');
  var objectApiNameInput = document.querySelector('input#DeveloperName');

  console.log("Field MasterLabel input found:", fieldMasterLabelInput);
  console.log("Field DeveloperName input found:", fieldDeveloperNameInput);
  console.log("Field Name input found:", fieldNameInput);
  console.log("Object Label input found:", objectLabelInput);
  console.log("Object API Name input found:", objectApiNameInput);

  // Check if we're creating a new field or object
  var isNewField = isNewItem(fieldDeveloperNameInput) || isNewItem(fieldNameInput);
  var isNewObject = isNewItem(objectApiNameInput);

  if (fieldMasterLabelInput && isNewField) {
    console.log("Adding event listener to Field MasterLabel input");
    fieldMasterLabelInput.addEventListener('blur', function() {
      console.log("Field MasterLabel blur event triggered");
      if (fieldDeveloperNameInput) {
        console.log("Updating Field DeveloperName input");
        DeveloperNameInputElement.setName(this, fieldDeveloperNameInput, 'Field1');
        console.log("Updated Field DeveloperName:", fieldDeveloperNameInput.value);
      } else if (fieldNameInput) {
        console.log("Updating Field Name input");
        DeveloperNameInputElement.setName(this, fieldNameInput, 'Field1');
        console.log("Updated Field Name:", fieldNameInput.value);
      }
    });
  }

  if (objectLabelInput && isNewObject) {
    console.log("Adding event listener to Object Label input");
    objectLabelInput.addEventListener('blur', function() {
      console.log("Object Label blur event triggered");
      if (objectApiNameInput) {
        console.log("Updating Object API Name input");
        DeveloperNameInputElement.setName(this, objectApiNameInput, 'Object1');
        console.log("Updated Object API Name:", objectApiNameInput.value);
      }
    });
  }
};

BfsApiName.init();