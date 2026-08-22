import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController.js';
const notesRouter = Router();

notesRouter.get('/', getAllNotes);

notesRouter.get('/:noteId', getNoteById);

notesRouter.post('/', createNote);

notesRouter.delete('/:noteId', deleteNote);

notesRouter.patch('/:noteId', updateNote);

export default notesRouter;
