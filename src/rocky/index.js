var rocky = require("rocky");

// Default values
var primaryColor = "#FF0000"; // banner color (red)
var stripeColor = "#000000"; // stripe color (black)
var secondaryColor = "#FFFFFF"; // time text color (white)
var dateColor = "#AAAAAA"; // text color for date (gray)
var stripeWidth = 4; // stripe width
var stripeSpacing = 12; // stripe spacing
var angle = 20; // stripe angle in deg

// Listen for app message
rocky.on('message', function(event) {
  var settings = event.data;

  // Update watchface settings
  if (settings.primaryColor) {
    primaryColor = '#' + settings.primaryColor;
  }
  if (settings.secondaryColor) {
    secondaryColor = '#' + settings.secondaryColor;
  }
  if (settings.dateColor) {
    dateColor = '#' + settings.dateColor;
  }
  if (settings.stripeWidth) {
    stripeWidth = settings.stripeWidth;
  }
  if (settings.stripeSpacing) {
    stripeSpacing = settings.stripeSpacing;
  }
  if (settings.angle) {
    angle = settings.angle;
  }

  // Request a redraw
  rocky.requestDraw();
});


rocky.on("draw", function (event) {
  // get time and set context
  var now = new Date();
  var ctx = event.context;
  var width = ctx.canvas.clientWidth;
  var height = ctx.canvas.clientHeight;
  var halfHeight = height / 2;

  ctx.clearRect(0, 0, width, height);

  // top patterns - background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, width, halfHeight);

  // calc the horizontal shift based on the angle
  var hShift = Math.tan(angle * Math.PI / 180) * halfHeight;

  // draw diagonal lines
  ctx.strokeStyle = stripeColor;
  for (var i = -width; i < width * 2; i += stripeSpacing) {
    ctx.beginPath();
    // start below visible area to ensure complete diagonal cover
    var startX = i;
    var startY = halfHeight;

    // calculate end coordinates moving up and right
    var endX = startX + hShift;
    var endY = 0;

    // draw the line
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = stripeWidth;
    ctx.stroke();
  }

  // time
  ctx.fillStyle = secondaryColor;
  ctx.font = "42px bold numbers Leco-numbers";
  ctx.textAlign = "center";
  ctx.fillText(
    now.getHours() + ":" + ("0" + now.getMinutes()).slice(-2),
    width / 2,
    height / 2 + 5
  );

  // date
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var dateStr = days[now.getDay()] + ", " + now.getDate() + ". " + months[now.getMonth()];
  ctx.font = "18px Gothic";
  ctx.fillStyle = dateColor;
  ctx.fillText(
    dateStr,
    width / 2,
    height / 2 + 50
  );
});

rocky.on("minutechange", function () {
  rocky.requestDraw();
});
