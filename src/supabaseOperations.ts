import { supabase } from './supabaseClient'
import { Note } from './types'

const getLocalNotes = (userId: string): Note[] => {
  const notes = localStorage.getItem(`notes_${userId}`)
  return notes ? JSON.parse(notes) : []
}

const saveLocalNotes = (userId: string, notes: Note[]) => {
  localStorage.setItem(`notes_${userId}`, JSON.stringify(notes))
}

export const fetchNotes = async (userId: string): Promise<Note[]> => {
  if (!supabase.auth) {
    return getLocalNotes(userId)
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('pinned', { ascending: false })
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
    return []
  }

  return data || []
}

export const addNote = async (note: Omit<Note, 'id'>): Promise<Note | null> => {
  if (!supabase.auth) {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
    }
    const notes = getLocalNotes(note.user_id)
    notes.push(newNote)
    saveLocalNotes(note.user_id, notes)
    return newNote
  }

  const { data, error } = await supabase
    .from('notes')
    .insert(note)
    .select()
    .single()

  if (error) {
    console.error('Error adding note:', error)
    return null
  }

  return data
}

export const updateNote = async (note: Note): Promise<Note | null> => {
  if (!supabase.auth) {
    const notes = getLocalNotes(note.user_id)
    const updatedNotes = notes.map(n => n.id === note.id ? note : n)
    saveLocalNotes(note.user_id, updatedNotes)
    return note
  }

  const { data, error } = await supabase
    .from('notes')
    .update(note)
    .eq('id', note.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    return null
  }

  return data
}

export const deleteNote = async (id: string): Promise<boolean> => {
  if (!supabase.auth) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (currentUser.email) {
      const notes = getLocalNotes(currentUser.email)
      const updatedNotes = notes.filter(note => note.id !== id)
      saveLocalNotes(currentUser.email, updatedNotes)
    }
    return true
  }

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting note:', error)
    return false
  }

  return true
}