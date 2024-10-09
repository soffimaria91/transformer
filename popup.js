document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('settings-form');

  // Load the saved preferences
  chrome.storage.sync.get(['namingConvention', 'prefix'], function(data) {
    if (data.namingConvention) {
      form.elements['naming-convention'].value = data.namingConvention;
    }
    if (data.prefix) {
      form.elements['prefix'].value = data.prefix;
    }
  });

  // Save the preferences when the form is submitted
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const namingConvention = form.elements['naming-convention'].value;
    const prefix = form.elements['prefix'].value;
    chrome.storage.sync.set({ namingConvention: namingConvention, prefix: prefix }, function() {
      console.log('Naming convention saved:', namingConvention);
      console.log('Prefix saved:', prefix);
    });
  });
});
