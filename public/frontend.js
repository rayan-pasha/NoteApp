document.addEventListener('DOMContentLoaded', function () {
  let notes; // Declare notes variable in the global scope
  let activeEditButton; // Declare activeEditButton variable in the global scope

  // Fetch existing notes on page load
  fetchNotes();

  // Attach event listener to the "Add Note" button
  document.querySelector('#addNoteButton').addEventListener('click', createNote);

  // Attach event listener to the "Save Changes" button in the edit modal
  document.querySelector('#saveEditButton').addEventListener('click', saveChanges);

  // Attach event listener to close the edit modal
  document.querySelector('.modal .close').addEventListener('click', closeEditModal);

  function fetchNotes() {
    // Fetch all notes from the server
    fetch('/notes')
      .then(response => response.json())
      .then(data => {
        notes = data; // Update the global notes variable
        displayNotes(notes);
      })
      .catch(error => console.error('Error:', error));
  }

  function displayNotes(notes) {
    const noteList = document.getElementById('note-list');
    noteList.innerHTML = ''; // Clear existing notes

    notes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.className = 'note';
      noteElement.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button class="editNoteButton" data-id="${note.id}">Edit Note</button>
        <button class="deleteNoteButton" data-id="${note.id}">Delete Note</button>
      `;
      noteList.appendChild(noteElement);
    });

    // Attach event listeners to the "Edit Note" and "Delete Note" buttons
    document.querySelectorAll('.editNoteButton').forEach(button => {
      button.addEventListener('click', openEditModal);
    });

    document.querySelectorAll('.deleteNoteButton').forEach(button => {
      button.addEventListener('click', deleteNote);
    });
  }

  function createNote() {
      
    // Get values from the input fields
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if(!title || !content) return 

    // Make a POST request to create a new note
    fetch('/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
      .then(response => response.json())
      .then(data => {
        // Update the note list after creating a new note
        fetchNotes();
      })
      .catch(error => console.error('Error:', error));
  }

  function openEditModal() {
    if (activeEditButton) {
      // Remove 'active' class from the previously active button
      activeEditButton.classList.remove('active');
    }

    // Mark the current button as active
    activeEditButton = this;
    activeEditButton.classList.add('active');

    const noteId = activeEditButton.getAttribute('data-id');
    const note = getNoteById(noteId);

    // Populate the edit modal with the current note data
    document.getElementById('editNoteTitle').value = note.title;
    document.getElementById('editNoteContent').value = note.content;

    // Show the edit modal
    document.getElementById('editModal').style.display = 'block';
  }

  function closeEditModal() {
    // Hide the edit modal
    document.getElementById('editModal').style.display = 'none';
  }

  function saveChanges() {
    if (activeEditButton) {
      const noteId = activeEditButton.getAttribute('data-id');
      const updatedTitle = document.getElementById('editNoteTitle').value;
      const updatedContent = document.getElementById('editNoteContent').value;

      if(!updatedTitle || !updatedContent) return 


      // Make a PUT request to update the note
      fetch(`/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          // Close the edit modal
          closeEditModal();
          // Update the note list after editing a note
          fetchNotes();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      console.error('No active edit button found');
    }
  }

  function deleteNote() {
    const noteId = this.getAttribute('data-id');
    // Make a DELETE request to delete the note
    fetch(`/notes/${noteId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then(data => {
        // Update the note list after deleting a note
        fetchNotes();
      })
      .catch(error => console.error('Error:', error));
  }

  function getNoteById(id) {
    return notes.find(note => note.id === id);
  }
});
