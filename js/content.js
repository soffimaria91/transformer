var BfsApiName = BfsApiName || {};

var DeveloperNameInputElement = DeveloperNameInputElement || {};
DeveloperNameInputElement.setName = function(d, c, g) {
  chrome.storage.sync.get(['namingConvention', 'prefix'], function(data) {
    const namingConvention = data.namingConvention || 'camelCase';
    const prefix = data.prefix || '';
    d = d.value.trim();
    if (d.length === 0) return;

    let formattedName = formatName(d, namingConvention);
    c.value = prefix + formattedName;

    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    c.dispatchEvent(inputEvent);
  });
  return !0;
};

function isNewItem(nameInput) {
  return nameInput && nameInput.value.trim() === '';
}

function handleFlowElementNaming() {
  const textInputs = document.querySelectorAll('input[type="text"]');
  let labelInput = textInputs[0];
  let apiNameInput = textInputs[1];

  if (labelInput && apiNameInput) {
    if (isNewItem(apiNameInput)) {
      let isFirstChange = true;

      labelInput.addEventListener('input', function() {
        if (isFirstChange) {
          DeveloperNameInputElement.setName(this, apiNameInput, 'FlowElement');
        }
      });

      labelInput.addEventListener('blur', function() {
        if (isFirstChange) {
          DeveloperNameInputElement.setName(this, apiNameInput, 'FlowElement');
          isFirstChange = false;
        }
      });

      if (labelInput.value) {
        DeveloperNameInputElement.setName(labelInput, apiNameInput, 'FlowElement');
        isFirstChange = false;
      }
    }
    return true;
  }
  return false;
}

function formatName(input, convention) {
  let words = input.split(/\s+/);
  let formattedName;

  if (convention === 'camelCase' || convention === 'pascalCase') {
    words = words.map(word => word.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue'));

    if (convention === 'camelCase') {
      formattedName = words[0].toLowerCase();
      formattedName += words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    } else {
      formattedName = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');
    }
  } else if (convention === 'noChange') {
    formattedName = input;
  } else {
    formattedName = input.replace(/\s+/g, '_');
  }

  return formattedName;
}

BfsApiName.init = function() {
  var fieldMasterLabelInput = document.querySelector('input#MasterLabel');
  var fieldDeveloperNameInput = document.querySelector('input#DeveloperName');
  var fieldNameInput = document.querySelector('input#Name');
  var objectLabelInput = document.querySelector('input#MasterLabel');
  var objectApiNameInput = document.querySelector('input#DeveloperName');

  var isNewField = isNewItem(fieldDeveloperNameInput) || isNewItem(fieldNameInput);
  var isNewObject = isNewItem(objectApiNameInput);

  if (fieldMasterLabelInput && isNewField) {
    fieldMasterLabelInput.addEventListener('blur', function() {
      if (fieldDeveloperNameInput) {
        DeveloperNameInputElement.setName(this, fieldDeveloperNameInput, 'Field1');
      } else if (fieldNameInput) {
        DeveloperNameInputElement.setName(this, fieldNameInput, 'Field1');
      }
    });
  }

  if (objectLabelInput && isNewObject) {
    objectLabelInput.addEventListener('blur', function() {
      if (objectApiNameInput) {
        DeveloperNameInputElement.setName(this, objectApiNameInput, 'Object1');
      }
    });
  }

  handleFlowElementNaming();

  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        handleFlowElementNaming();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

document.addEventListener('DOMContentLoaded', BfsApiName.init);
BfsApiName.init();