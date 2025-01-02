import React, { useState, useEffect } from 'react'
import { Sun, Moon, Search, Plus } from 'lucide-react'
import NoteList from './components/NoteList'
import AddNoteModal from './components/AddNoteModal'
import { Note } from './types'
import SignIn from './components/SignIn'
import { supabase } from './supabaseClient'
import { fetchNotes, addNote as addNoteToSupabase, updateNote as updateNoteInSupabase, deleteNote as deleteNoteFromSupabase } from './supabaseOperations'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGuest, setIsGuest] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadNotes()
    } else if (isGuest) {
      const savedNotes = localStorage.getItem('guestNotes')
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes))
      }
    }
  }, [isAuthenticated, isGuest, userId])

  useEffect(() => {
    if (isGuest) {
      localStorage.setItem('guestNotes', JSON.stringify(notes))
    }
  }, [notes, isGuest])

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()
    setIsAuthenticated(!!data.session)
    setUserId(data.session?.user.id || null)
  }

  const loadNotes = async () => {
    if (userId) {
      const fetchedNotes = await fetchNotes(userId)
      setNotes(fetchedNotes)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleSignIn = (isGuest: boolean) => {
    setIsAuthenticated(!isGuest)
    setIsGuest(isGuest)
    if (isGuest) {
      setUserId('guest')
    }
  }

  const handleSignOut = async () => {
    if (!isGuest) {
      await supabase.auth.signOut()
    }
    setIsAuthenticated(false)
    setIsGuest(false)
    setUserId(null)
    setNotes([])
  }

  const addNote = async (newNote: Omit<Note, 'id'>) => {
    if (isGuest) {
      const noteWithId = { ...newNote, id: Date.now().toString() }
      setNotes([...notes, noteWithId])
    } else if (userId) {
      const addedNote = await addNoteToSupabase({ ...newNote, user_id: userId })
      if (addedNote) {
        setNotes([...notes, addedNote])
      }
    }
  }

  const deleteNote = async (id: string) => {
    if (isGuest) {
      setNotes(notes.filter(note => note.id !== id))
    } else {
      const success = await deleteNoteFromSupabase(id)
      if (success) {
        setNotes(notes.filter(note => note.id !== id))
      }
    }
  }

  const editNote = async (updatedNote: Note) => {
    if (isGuest) {
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
    } else {
      const updated = await updateNoteInSupabase(updatedNote)
      if (updated) {
        setNotes(notes.map(note => note.id === updated.id ? updated : note))
      }
    }
  }

  const togglePin = async (id: string) => {
    const noteToUpdate = notes.find(note => note.id === id)
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, pinned: !noteToUpdate.pinned }
      if (isGuest) {
        setNotes(notes.map(note => note.id === id ? updatedNote : note))
      } else {
        const updated = await updateNoteInSupabase(updatedNote)
        if (updated) {
          setNotes(notes.map(note => note.id === updated.id ? updated : note))
        }
      }
    }
  }

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return a.pinned ? -1 : 1
    })

  if (!isAuthenticated && !isGuest) {
    return <SignIn onSignIn={handleSignIn} />
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notes Manager</h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Add Note
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full p-2 pl-10 border rounded dark:bg-gray-800 dark:border-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <NoteList 
          notes={filteredNotes}
          onDelete={deleteNote}
          onEdit={editNote}
          onTogglePin={togglePin}
        />

        {isAddModalOpen && (
          <AddNoteModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={addNote}
            userId={userId || 'guest'}
          />
        )}
      </div>
    </div>
  )
}

export default App