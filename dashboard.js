// Dashboard JavaScript - Notes CRUD Operations

let currentUser = null;
let currentNoteId = null;
let notes = [];

// Initialize dashboard
async function initDashboard() {
    // Protect page - ensure user is authenticated
    const session = await protectPage();
    
    if (session && session.user) {
        currentUser = session.user;
        
        // Display user email
        const userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.textContent = currentUser.email;
        }
        
        // Load notes
        await loadNotes();
        
        // Set up event listeners
        setupEventListeners();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }
    
    // Create note button
    const createNoteBtn = document.getElementById('createNoteBtn');
    if (createNoteBtn) {
        createNoteBtn.addEventListener('click', () => openNoteModal());
    }
    
    // Note form submission
    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', handleNoteSave);
    }
    
    // Modal close on background click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal.id === 'noteModal') {
                    closeNoteModal();
                } else if (modal.id === 'deleteModal') {
                    closeDeleteModal();
                }
            }
        });
    });
}

// Load all notes for current user
async function loadNotes() {
    const notesContainer = document.getElementById('notesContainer');
    const emptyState = document.getElementById('emptyState');
    
    try {
        const { data, error } = await supabaseClient
            .from('notes')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        notes = data || [];
        
        // Display notes or empty state
        if (notes.length === 0) {
            notesContainer.innerHTML = '';
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        } else {
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            displayNotes();
        }
        
    } catch (error) {
        console.error('Error loading notes:', error);
        notesContainer.innerHTML = '<div class="error-message show">Failed to load notes. Please refresh the page.</div>';
    }
}

// Display notes in the grid
function displayNotes() {
    const notesContainer = document.getElementById('notesContainer');
    
    if (notes.length === 0) {
        notesContainer.innerHTML = '';
        return;
    }
    
    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card" onclick="viewNote('${note.id}')">
            <div class="note-header">
                <h3 class="note-title">${escapeHtml(note.title)}</h3>
                <div class="note-actions" onclick="event.stopPropagation();">
                    <button class="note-btn" onclick="editNote('${note.id}')" title="Edit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="note-btn delete" onclick="confirmDeleteNote('${note.id}')" title="Delete">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="note-content">${escapeHtml(note.content)}</div>
            <div class="note-footer">
                <span class="note-date">${formatDate(note.updated_at || note.created_at)}</span>
            </div>
        </div>
    `).join('');
}

// Open note modal for creating or editing
function openNoteModal(noteId = null) {
    const modal = document.getElementById('noteModal');
    const modalTitle = document.getElementById('modalTitle');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const saveBtn = document.getElementById('saveNoteBtn');
    const noteError = document.getElementById('noteError');
    
    // Clear any previous errors
    if (noteError) {
        noteError.classList.remove('show');
        noteError.textContent = '';
    }
    
    if (noteId) {
        // Edit mode
        const note = notes.find(n => n.id === noteId);
        if (note) {
            modalTitle.textContent = 'Edit Note';
            noteTitle.value = note.title;
            noteContent.value = note.content;
            currentNoteId = noteId;
            saveBtn.textContent = 'Update Note';
        }
    } else {
        // Create mode
        modalTitle.textContent = 'Create Note';
        noteTitle.value = '';
        noteContent.value = '';
        currentNoteId = null;
        saveBtn.textContent = 'Save Note';
    }
    
    modal.classList.add('show');
    noteTitle.focus();
}

// Close note modal
function closeNoteModal() {
    const modal = document.getElementById('noteModal');
    modal.classList.remove('show');
    currentNoteId = null;
}

// Handle note save (create or update)
async function handleNoteSave(e) {
    e.preventDefault();
    
    const noteTitle = document.getElementById('noteTitle').value.trim();
    const noteContent = document.getElementById('noteContent').value.trim();
    const saveBtn = document.getElementById('saveNoteBtn');
    const noteError = document.getElementById('noteError');
    
    if (!noteTitle || !noteContent) {
        noteError.textContent = 'Please fill in all fields';
        noteError.classList.add('show');
        return;
    }
    
    // Disable button
    saveBtn.disabled = true;
    saveBtn.textContent = currentNoteId ? 'Updating...' : 'Saving...';
    
    try {
        if (currentNoteId) {
            // Update existing note
            const { error } = await supabaseClient
                .from('notes')
                .update({
                    title: noteTitle,
                    content: noteContent,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', currentNoteId)
                .eq('user_id', currentUser.id);
            
            if (error) throw error;
        } else {
            // Create new note
            const { error } = await supabaseClient
                .from('notes')
                .insert({
                    title: noteTitle,
                    content: noteContent,
                    user_id: currentUser.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                });
            
            if (error) throw error;
        }
        
        // Reload notes and close modal
        await loadNotes();
        closeNoteModal();
        
    } catch (error) {
        console.error('Error saving note:', error);
        noteError.textContent = error.message || 'Failed to save note';
        noteError.classList.add('show');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = currentNoteId ? 'Update Note' : 'Save Note';
    }
}

// View note (open in modal)
function viewNote(noteId) {
    openNoteModal(noteId);
}

// Edit note
function editNote(noteId) {
    openNoteModal(noteId);
}

// Confirm delete note
function confirmDeleteNote(noteId) {
    currentNoteId = noteId;
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.add('show');
    
    // Set up confirm button
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.onclick = () => deleteNote(noteId);
}

// Close delete modal
function closeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    deleteModal.classList.remove('show');
    currentNoteId = null;
}

// Delete note
async function deleteNote(noteId) {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';
    
    try {
        const { error } = await supabaseClient
            .from('notes')
            .delete()
            .eq('id', noteId)
            .eq('user_id', currentUser.id);
        
        if (error) throw error;
        
        // Reload notes and close modal
        await loadNotes();
        closeDeleteModal();
        
    } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete';
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            if (minutes === 0) {
                return 'Just now';
            }
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        }
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days === 1) {
        return 'Yesterday';
    } else if (days < 7) {
        return `${days} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', initDashboard);
