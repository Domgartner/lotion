import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Sidebar({ notes, addNote, activeNote, setActiveNote, setUserEditing }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(notes);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="notes-list-cont">
      <div className="notes-head">
        <h2>Notes</h2>
        <div className="plus-container" onClick={() => addNote()}>
          <i>&#43;</i>
        </div>
      </div>
      <div className="search-area">
        <input type="text" placeholder="Search Notes" value={searchTerm} onChange={handleSearchChange}/>
        {searchTerm && (<button onClick={handleClearSearch} aria-label="Clear search">&times;</button>)}
      </div>
      <div className="notes-list-body">
      {notes.length === 0 && <h3 id="no-notes">No Notes Yet</h3>}
      {filteredNotes.length === 0 && notes.length !== 0 && <h3 id="no-notes">No Notes Found</h3>}
      {searchTerm.length > 0 && filteredNotes.length > 0 && (<h3 id="results-found">Search Results Found:</h3>)}
        <div className="notes-list">
          {filteredNotes.map((note, index) => (
            <Link to={`/notes/${index+1}`} key={note.id}>
              <div
                className={`note ${note.id === activeNote && 'active'}`}
                key={note.id}
                onClick={() => {
                  setActiveNote(note.id);
                  setUserEditing(false);
                }}>
                <h2>{note.title ? note.title.substr(0, 30) : 'Untitled'}</h2>
                <small className="note-date">
                  {note.dateCreated &&
                    new Date(note.dateCreated).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                </small>
                <p>
                  {note.body ? (note.body.length < 0 ? '...' : `${note.body.substr(0, 45).replace(/<\/?[^>]+(>|$)/g, '')}...`) : '...'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Sidebar;