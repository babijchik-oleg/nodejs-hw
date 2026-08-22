import Note from '../models/note';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({
    status: 200,
    data: notes,
  });
  res.json(notes);
};

export const getNoteById = async (req, res) => {
  const { id } = req.params;
  const result = await Note.findById(id);
  if (!result) {
    throw createHttpError(404, `Note not found`);
  }
  res.json(result);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  const deleteNote = await Note.findOneAndDelete(id);
  if (!deleteNote) {
    throw createHttpError(404, `Note not found`);
  }
  res.json(deleteNote);
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const updateNote = await Note.findByIdAndUpdate(id, req.body, {
    returnDocument: 'after',
  });
  if (!updateNote) {
    throw createHttpError(404, `Note not found`);
  }

  res.json(updateNote);
};
