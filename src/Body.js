import { useEffect, useState, useRef } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Body({ activeNote, confirmDelete, onUpdateNote, setUserEditing, userEditing, notes, isNotesListVisible }) {
  // const [editedNote, setEditedNote] = useState(activeNote);
  const [title, setTitle] = useState(activeNote?.title || 'Untitled');
  const [editedTitle, setEditedTitle] = useState(title);  
  const [currentBody, setCurrentBody] = useState('');

  useEffect(() => {
    if(activeNote){
      setTitle(activeNote?.title || 'Untitled');
      setEditedTitle(activeNote?.title || 'Untitled');
      setCurrentBody(activeNote.formattedBody);}
    else {
      setTitle('');
      setCurrentBody('');}
  }, [activeNote]);

  const quillref = useRef(null);
  const onSave = () => {
    const quill = quillref.current.getEditor();
    const html = quill.container.firstChild.innerHTML;
    const savedDate = document.getElementById('note-date').value;
    const plainText = quill.getText();
    let content = {
      id: activeNote.id,
      body: plainText,
      formattedBody: html,
      title: editedTitle,
      dateCreated: savedDate,};
    const activeNoteIndex = notes.findIndex(note => note.id === activeNote.id);
    window.history.replaceState({ index: activeNoteIndex }, '', `/notes/${activeNoteIndex+1}`);
    onUpdateNote(content);
  };
  
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  if (!activeNote) {
    return <div id="default-body"><p>Select a note, or create a new one.</p></div>;
  }

  function handleTitleChange(event) {
    setEditedTitle(event.target.value);
  }

  const editMode = () => {
    const activeNoteIndex = notes.findIndex(note => note.id === activeNote.id);
    window.history.replaceState({ index: activeNoteIndex }, '', `/notes/${activeNoteIndex+1}/edit`);
    setUserEditing(!userEditing);
  }

  return (
    <div className='note-edit-area' style={{width: isNotesListVisible ? '' : '100vw' }}>
      <div className='note-edit-head'>
        <div className="input-container">
        {userEditing ? (
          <><input
                type="text"
                autoFocus
                contentEditable
                placeholder="Untitled"
                value={editedTitle}
                onChange={handleTitleChange}
            /><input
                type="datetime-local"
                id = "note-date"
                defaultValue={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, -8)}
                onChange={formatDate()} /></>
        ) : (
          <><h2 className="view-title">{title}</h2>
          <p className="view-date">{formatDate(activeNote.dateCreated)}</p></>
        )}
        </div>
        <div className="save-delete">
          <div className="save-btn" onClick={onSave}>
            <h3 id="save" onClick={editMode}>{userEditing ?'Save':'Edit'}</h3>
          </div>
          <div className="delete-btn">
            <h3 id="delete" onClick={() => confirmDelete(activeNote.id)}>Delete</h3>
          </div>
        </div>
      </div>
      <div className="note-edit-body">{userEditing? (
          <ReactQuill
            ref={quillref}
            theme="snow"
            value = {currentBody}
            onChange={(value)=>setCurrentBody(value)}
            placeholder='Your Note Here'
            modules={{
                toolbar: [
                [{ 'header': [1, 2, 3, 4, false] }],
                ['bold', 'italic', 'underline', 'strike', 'link'],
                [{ 'color': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
                ],}}
            formats={[    "header",    "bold",    "italic",    "underline",    "strike",    "link", "color",  "list",    "bullet",    "clean",  ]}
            style={{ fontSize: "25px", width: isNotesListVisible ? "76vw" : "100vw"}}/>
      ):(
       <div className="save-text" dangerouslySetInnerHTML={{__html: activeNote.formattedBody}}></div>
      )}    
          </div>
        </div>
 );
}
export default Body;