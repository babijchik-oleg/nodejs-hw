import { Router } from 'express';

import {
  getAllNotes,
  getNoteById,
  createNote,
  deleteNote,
  updateNote,
} from '../controllers/notesController';
const notesRouter = Router();

notesRouter.get('/notes', getAllNotes);

notesRouter.get('/notes/:noteId', getNoteById);

notesRouter.post('/notes', createNote);

notesRouter.delete('/notes/:noteId', deleteNote);

notesRouter.patch('/:id', updateNote);

export default notesRouter;
