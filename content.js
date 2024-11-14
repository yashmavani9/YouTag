// content.js

// Function to add the notes input box UI to the specified location in the YouTube playlist page
function addNotesUI() {
    // Select the div where we want to insert the note input box
    const targetContainer = document.querySelector("#page-manager > ytd-browse > yt-page-header-renderer > yt-page-header-view-model > div.page-header-view-model-wiz__page-header-content");

    if (!targetContainer) return; // Exit if the target container is not found

    // Check if notes UI is already added to avoid duplicates
    if (document.getElementById('playlist-note-container')) return;

    // Create the notes container
    const noteContainer = document.createElement('div');
    noteContainer.id = 'playlist-note-container';
    noteContainer.style.padding = '16px';
    noteContainer.style.background = '#f9f9f9';
    noteContainer.style.border = '1px solid #ddd';
    noteContainer.style.marginTop = '10px';

    // Create a text area for adding/editing notes
    const noteText = document.createElement('textarea');
    noteText.id = 'noteText';
    noteText.placeholder = "Enter your note here...";
    noteContainer.appendChild(noteText);

    // Insert the notes container into the target container
    targetContainer.appendChild(noteContainer);

    // Get the playlist ID from the URL and load the saved note if it exists
    const playlistId = new URLSearchParams(window.location.search).get('list');
    loadNote(playlistId, noteText);

    // Save note on input
    noteText.addEventListener('input', function() {
        saveNote(playlistId, this.value);
    });
}

// Function to load a saved note for a specific playlist
function loadNote(playlistId, noteText) {
    chrome.storage.sync.get([playlistId], function(result) {
        if (result[playlistId]) {
            noteText.value = result[playlistId];
        } else {
            noteText.value = ''; // Show empty if no note exists
        }
    });
}

// Function to save a note for a specific playlist
function saveNote(playlistId, note) {
    chrome.storage.sync.set({ [playlistId]: note });
}

// Run addNotesUI function when the extension icon is clicked
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "open_notes") {
        addNotesUI();
        sendResponse({ status: "Notes UI loaded" });
    }
});
