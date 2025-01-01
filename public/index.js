// Define DOM Elements
let saveEl = document.getElementById("save-el");
let countEl = document.getElementById("count-el");
let totalEl = document.getElementById("total-el");
let audio = document.getElementById('audioPlayer');

// Scream Count
let count = 0;

// Global Scream Count
let total_screams = 0;

// Add Event Listener for Playing Cat Scream Audio on Button Click
document.getElementById('increment-btn')
  .addEventListener('click', function () {
        audio.play();
    });

// Start by calling API Endpoint to Get Global Cat Screams
getTotalCatScreams();

// Increment Local Cat Screams
function increment() {
    count += 1;
    countEl.textContent = count;
}

// Add the cat screams to the global number of cat screams
function save() {
  
    // Update display of local cat screams
    let countStr = count + " - ";
    saveEl.textContent += countStr;
    countEl.textContent = 0; 
  
    // Call the API to post and get global cat screams
    addTotalCatScreams();
    getTotalCatScreams();
  
    // Reset local cat screams
    count = 0;
}

// Call API to Get Total Cat Screams
async function getTotalCatScreams() {
    try {
        const response = await fetch('/getNumber');
        const number = await response.text();
        total_screams = parseInt(number);
        totalEl.textContent = "Total Global Cat Screams: " + total_screams;
    } 
    catch (error) {
        console.error('Error fetching global cat screams:', error);
    }
}

// Call API to Post Local Cat Screams
async function addTotalCatScreams() {
    const newNumber = count;
    try {
        await fetch('/setNumber', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: newNumber }),
        });
      
        // Retrieve the updated number of total cat screams
        getTotalCatScreams();
      
    } catch (error) {
        console.error('Error posting number of cat screams:', error);
    }
}