import { useEffect, useState } from "react";
import uuid from 'react-uuid';
import Sidebar from "./Sidebar";
import Body from "./Body";

function Layout() {
    // const [notes, setNotes] = useState(JSON.parse(localStorage.notes) || []);
    const localStorageNotes = localStorage.getItem('notes');
const initialNotes = localStorageNotes ? JSON.parse(localStorageNotes) : [];

const [notes, setNotes] = useState(initialNotes);

    const [isNotesListVisible, setIsNotesListVisible] = useState(true);
    const [activeNote, setActiveNote] = useState(false);
    const[userEditing,setUserEditing]=useState(true);

    function addNote() {
    const newNote = {
        id: uuid(),
        title: "Untitled",
        body: "",
        dateCreated: undefined,
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    const activeNoteIndex = notes.findIndex(note => note.id === activeNote.id);
    window.history.replaceState({ index: activeNoteIndex }, '', `/notes/${activeNoteIndex+2}/edit`);
    setUserEditing(true);
    };

    const confirmDelete = (idToDelete) => {
    const answer = window.confirm("Are you sure?");
    if (answer) {
        setNotes(notes.filter((note) => note.id !== idToDelete));
        window.history.replaceState({  }, '', `/notes`);
        setUserEditing(false);
    }
    };

    const getActiveNote = () => {
        if (!activeNote) {
        return false;
        }
        return notes.find((note) => note.id === activeNote);
    };
    
    const onUpdateNote = (updatedNote) => {
    const arrayUpdated = notes.map((note) => {
        if (note.id === activeNote) {
        return updatedNote;
        }
        return note;
    });
    setNotes(arrayUpdated);
    };

    function noteToggle() {
        setIsNotesListVisible(prevState => !prevState);
    };

    const enableDarkMode = () => {
        let html = document.querySelector('html');
        let root = document.querySelector('#root');
        if (html.classList.contains("dark-mode")) {
          html.classList.remove("dark-mode");
          root.classList.remove("dark-mode");
        } else {
          html.classList.add("dark-mode");
          root.classList.add("dark-mode");
        }
      }
      

    useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

        return(
            <>  <div id="head-area">
                    <div className='menu-icon-cont' onClick={() => {noteToggle()}}>
                    <i className='menu-icon'>&#9776;</i>
                    </div>
                    <div className='titles'>
                        <h1 className='main-title'>Lotion</h1>
                        <h4 className='minor-title'>Like Notion, but worse.</h4>
                    </div>
                    <div className="dark-mode-btn" onClick={enableDarkMode}><i>&#9681;</i></div>
                </div>
                <div className={`main-body ${!isNotesListVisible && 'full'}`}>
                    {isNotesListVisible && (
                        <Sidebar
                            notes={notes}
                            addNote={addNote}
                            activeNote={activeNote}
                            setActiveNote={setActiveNote}
                            setUserEditing={setUserEditing}/>)}
                    <Body
                        activeNote={getActiveNote()}
                        confirmDelete={confirmDelete}
                        onUpdateNote={onUpdateNote}
                        setUserEditing={setUserEditing}
                        userEditing = {userEditing}
                        notes={notes}
                        isNotesListVisible = {isNotesListVisible}/>
                </div></> 
        );
}
export default Layout;