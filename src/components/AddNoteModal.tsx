import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Note } from '../types'

interface AddNoteModalProps {
  onClose: () => void
  onAdd: (note: Omit<Note, 'id'>) => void
  userId: string
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({ onClose, onAdd, userId }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && content) {
      const newNote: Omit<Note, 'id'> = {
        user_id: userId,
        title,
        content,
        tags: tags.filter(tag => tag.trim() !== ''),
        date: new Date().toISOString(),
        pinned: false,
      }
      onAdd(newNote)
      onClose()
    }
  }

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag])
      setCurrentTag('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Add New Note</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-4 border rounded bg-gray-700 border-gray-600 text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            className="w-full p-2 mb-4 border rounded bg-gray-700 border-gray-600 text-white"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Add tag"
              className="flex-grow p-2 border rounded-l bg-gray-700 border-gray-600 text-white"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag()
                }
              }}
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-700 text-white bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddNoteModal