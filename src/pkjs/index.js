Pebble.addEventListener('showConfiguration', function() {
  // get current settings or set defaults
  var currentSettings = {
    primaryColor: localStorage.getItem('primaryColor') || '#FF0000',
    secondaryColor: localStorage.getItem('secondaryColor') || '#FFFFFF',
    dateColor: localStorage.getItem('dateColor') || '#AAAAAA',
    stripeWidth: localStorage.getItem('stripeWidth') || 4,
    stripeSpacing: localStorage.getItem('stripeSpacing') || 12,
    angle: localStorage.getItem('angle') || 20
  };

  // encode settings for url
  var params = encodeURIComponent(JSON.stringify(currentSettings));

  var configURL = 'data:text/html,' + encodeURIComponent(`
    <html>
      <head>
        <title>Watchface Settings</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .item { margin-bottom: 15px; }
          input[type="number"] { width: 60px; }
          .button-container { margin-top: 20px; display: flex; gap: 10px; }
          button { padding: 8px 16px; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>Watchface Settings</h1>

        <div class="item">
          <label for="primaryColor">Banner Color:</label>
          <input type="color" id="primaryColor" value="#FF0000">
        </div>

        <div class="item">
          <label for="secondaryColor">Time Text Color:</label>
          <input type="color" id="secondaryColor" value="#FFFFFF">
        </div>

        <div class="item">
          <label for="dateColor">Date Color:</label>
          <input type="color" id="dateColor" value="#AAAAAA">
        </div>

        <div class="item">
          <label for="stripeWidth">Stripe Width:</label>
          <input type="number" id="stripeWidth" min="1" max="10" value="4" required>
          <span>(1-10)</span>
        </div>

        <div class="item">
          <label for="stripeSpacing">Stripe Spacing:</label>
          <input type="number" id="stripeSpacing" min="5" max="30" value="12" required>
          <span>(5-30)</span>
        </div>

        <div class="item">
          <label for="angle">Stripe Angle:</label>
          <input type="number" id="angle" min="0" max="45" value="20" required>
          <span>(0-45)</span>
        </div>

        <div class="button-container">
          <button id="save">Save Settings</button>
          <button id="reset">Reset to Defaults</button>
        </div>

        <script>
          // default values
          var defaults = {
            primaryColor: "#FF0000",
            secondaryColor: "#FFFFFF",
            dateColor: "#AAAAAA",
            stripeWidth: 4,
            stripeSpacing: 12,
            angle: 20
          };

          // load settings from url
          function loadCurrentSettings() {
            try {
              var params = (window.location.href.split('?')[1] || '').split('&');
              var hash = (window.location.hash || '').slice(1);

              var settings;
              if (hash) {
                settings = JSON.parse(decodeURIComponent(hash));
              } else if (params.length > 0 && params[0]) {
                settings = JSON.parse(decodeURIComponent(params[0]));
              }

              if (settings) {
                if (settings.primaryColor) {
                  document.getElementById('primaryColor').value = settings.primaryColor;
                }
                if (settings.secondaryColor) {
                  document.getElementById('secondaryColor').value = settings.secondaryColor;
                }
                if (settings.dateColor) {
                  document.getElementById('dateColor').value = settings.dateColor;
                }
                if (settings.stripeWidth) {
                  document.getElementById('stripeWidth').value = settings.stripeWidth;
                }
                if (settings.stripeSpacing) {
                  document.getElementById('stripeSpacing').value = settings.stripeSpacing;
                }
                if (settings.angle) {
                  document.getElementById('angle').value = settings.angle;
                }
              }
            } catch (e) {
              console.log('Error loading settings: ' + e);
            }
          }

          // reset form to default values
          function resetToDefaults() {
            document.getElementById('primaryColor').value = defaults.primaryColor;
            document.getElementById('secondaryColor').value = defaults.secondaryColor;
            document.getElementById('dateColor').value = defaults.dateColor;
            document.getElementById('stripeWidth').value = defaults.stripeWidth;
            document.getElementById('stripeSpacing').value = defaults.stripeSpacing;
            document.getElementById('angle').value = defaults.angle;
          }

          // save button event listener
          document.getElementById('save').addEventListener('click', function() {
            var numberInputs = document.querySelectorAll('input[type="number"]');
            var valid = true;

            numberInputs.forEach(function(input) {
              var value = parseInt(input.value);
              var min = parseInt(input.min);
              var max = parseInt(input.max);

              if (isNaN(value) || value < min || value > max) {
                alert(input.id + " must be between " + min + " and " + max);
                valid = false;
              }
            });

            if (!valid) return;

            var options = {
              primaryColor: document.getElementById('primaryColor').value.replace('#', ''),
              secondaryColor: document.getElementById('secondaryColor').value.replace('#', ''),
              dateColor: document.getElementById('dateColor').value.replace('#', ''),
              stripeWidth: parseInt(document.getElementById('stripeWidth').value),
              stripeSpacing: parseInt(document.getElementById('stripeSpacing').value),
              angle: parseInt(document.getElementById('angle').value)
            };

            window.location.href = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(options));
          });

          // reset button event listener
          document.getElementById('reset').addEventListener('click', resetToDefaults);

          // load settings on page load
          window.addEventListener('load', loadCurrentSettings);
        </script>
      </body>
    </html>
  `);

  Pebble.openURL(configURL + '#' + params);
});

// handle configuration result
Pebble.addEventListener('webviewclosed', function(e) {
  if (e && e.response) {
    try {
      var options = JSON.parse(decodeURIComponent(e.response));

      // save to localstorage
      if (options.primaryColor) localStorage.setItem('primaryColor', '#' + options.primaryColor);
      if (options.secondaryColor) localStorage.setItem('secondaryColor', '#' + options.secondaryColor);
      if (options.dateColor) localStorage.setItem('dateColor', '#' + options.dateColor);
      if (options.stripeWidth) localStorage.setItem('stripeWidth', options.stripeWidth);
      if (options.stripeSpacing) localStorage.setItem('stripeSpacing', options.stripeSpacing);
      if (options.angle) localStorage.setItem('angle', options.angle);

      // send to watch
      Pebble.postMessage(options);
    } catch (error) {
      console.log('Error parsing settings: ' + error);
    }
  }
});
