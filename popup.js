document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('settings-form');

  // Load the saved preference
  chrome.storage.sync.get('namingConvention', function(data) {
    if (data.namingConvention) {
      form.elements['naming-convention'].value = data.namingConvention;
    }
  });

  // Save the preference when the form is submitted
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const namingConvention = form.elements['naming-convention'].value;
    chrome.storage.sync.set({ namingConvention: namingConvention }, function() {
      console.log('Naming convention saved:', namingConvention);
    });
  });
});
