const sipster = require('sipster'); // Import the Sipster module
const hardcodedPassword = 'lucesipN';  // Replace with your actual hardcoded password


// Initialize pjsip
sipster.init();

// Set up a SIP account, we need at least one -- as required by pjsip.
// Replace 'sip:192.168.100.10' with the SIP address you're connecting to.
const acct = new sipster.Account({
  idUri: 'sip:192.168.100.10'
});

let currentCall = null;

// Set up a transport to listen for incoming connections, defaults to UDP
const transport = new sipster.Transport({ port: 5060 });
function updateFeedback(message) {
  document.getElementById('feedback').textContent = message;
}


document.getElementById('startCall').addEventListener('click', () => {
  // Start a call
  const sipAddress = document.getElementById('sipAddress').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  if (sipAddress && phoneNumber) {
    currentCall = acct.makeCall(`sip:${phoneNumber}@${sipAddress}`);
    updateFeedback('Call started...');
  } else {
    updateFeedback('Please enter a SIP address and phone number.');
  }
});


document.getElementById('hangUp').addEventListener('click', () => {
  // Hang up the current call, if there is one
  if (currentCall) {
    currentCall.hangup();
    currentCall = null;
    updateFeedback('Call ended.');
  } else {
    updateFeedback('No call to hang up.');
  }
});

document.getElementById('sendMessage').addEventListener('click', () => {
  // Send a message
  const sipAddress = document.getElementById('sipAddress').value;
  const messageContent = document.getElementById('messageContent').value;
  if (sipAddress && messageContent) {
    acct.sendMessage(sipAddress, messageContent);
    updateFeedback('Message sent.');
  } else {
    updateFeedback('Please enter both a SIP address and a message.');
  }
});

document.getElementById('changeCredentials').addEventListener('click', () => {
  const newUsername = document.getElementById('newUsername').value;
  const newPassword = document.getElementById('newPassword').value;
  const enteredPassword = document.getElementById('hardcodedPassword').value;

  if (enteredPassword === hardcodedPassword) {
    // Update the username and password
    // Replace 'sip:192.168.100.10' with the SIP address you're connecting to.
    acct = new sipster.Account({
      idUri: `sip:${newUsername}@192.168.100.10`,
      regConfig: {
        registrarUri: 'sip:192.168.100.10'
      },
      credInfo: [{
        scheme: 'Digest',
        realm: '*',
        username: newUsername,
        dataType: 0,  // for plaintext password
        data: newPassword
      }]
    });

    updateFeedback('Credentials updated successfully.');
  } else {
    updateFeedback('Incorrect hardcoded password. Please try again.');
  }
});

// Finalize the pjsip initialization phase
sipster.start();

// Add more event listeners as needed for the other buttons.
