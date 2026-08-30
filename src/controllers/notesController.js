import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { tag, search, page = 1, perPage = 10 } = req.query;
  const pageNumber = Number(page);
  const limit = Number(perPage);
  const skip = (pageNumber - 1) * limit;

  const myQuery = Note.find();

  if (tag) {
    myQuery.where('tag').equals(tag);
  }

  if (search) {
    myQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const filter = myQuery.getFilter();
  const [totalNotes, notes] = await Promise.all([
    Note.countDocuments(filter),
    myQuery.skip(skip).limit(limit),
  ]);
  const totalPages = Math.ceil(totalNotes / limit);

  res.status(200).json({
    page: pageNumber,
    perPage: limit,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const result = await Note.findById(noteId);
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
  const { noteId } = req.params;
  const deleteNote = await Note.findOneAndDelete({ _id: noteId });
  if (!deleteNote) {
    throw createHttpError(404, `Note not found`);
  }
  res.json(deleteNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNote = await Note.findByIdAndUpdate(noteId, req.body, {
    returnDocument: 'after',
  });
  if (!updateNote) {
    throw createHttpError(404, `Note not found`);
  }

  res.json(updateNote);
};
