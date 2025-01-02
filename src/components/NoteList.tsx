import React, { useState } from 'react'
import { Edit, Trash, Pin } from 'lucide-react'
import { Note } from '../types'
import EditNoteModal from './EditNoteModal'

interface NoteListProps {
  notes: Note[]
  onDelete: (id: string) => void
  onEdit: (note: Note) => void
  onTogglePin: (id: string) => void
}

const NoteList: React.FC<NoteListProps> = ({ notes, onDelete, onEdit, onTogglePin }) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-semibold text-white">{note.title}</h2>
            <div className="flex space-x-2">
              <button onClick={() => onTogglePin(note.id)} className="text-gray-400 hover:text-yellow-500">
                <Pin size={20} className={note.pinned ? 'text-yellow-500' : ''} />
              </button>
              <button onClick={() => setEditingNote(note)} className="text-gray-400 hover:text-blue-500">
                <Edit size={20} />
              </button>
              <button onClick={() => onDelete(note.id)} className="text-gray-400 hover:text-red-500">
                <Trash size={20} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mb-2">{new Date(note.date).toLocaleDateString()}</p>
          <p className="mb-4 text-gray-300">{note.content}</p>
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <span key={index} className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onEdit={onEdit}
          allTags={allTags}
        />
      )}
    </div>
  )
}

export default NoteList