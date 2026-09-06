import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const {
    tag,
    search,
    page = 1,
    perPage = 10,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;

  const { _id: userId } = req.user;
  const pageNumber = Number(page);
  const limit = Number(perPage);
  const skip = (pageNumber - 1) * limit;

  const myQuery = Note.find();
  if (userId) {
    myQuery.where('userId').equals(userId);
  }
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
    myQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .populate('userId', 'username'),
    Note.countDocuments(filter),
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
  const { _id: userId } = req.user;
  const result = await Note.findOne({ _id: noteId, userId });
  if (!result) {
    throw createHttpError(404, `Note not found`);
  }
  res.json(result);
};

export const createNote = async (req, res) => {
  const { _id: userId } = req.user;
  const newNote = await Note.create({ ...req.body, userId });
  await newNote.populate('userId', 'email');
  res.status(201).json(newNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;
  const deleteNote = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!deleteNote) {
    throw createHttpError(404, `Note not found`);
  }
  res.json(deleteNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { _id: userId } = req.user;
  const updateNote = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    req.body,
    {
      returnDocument: 'after',
      runValidators: true,
    },
  );
  if (!updateNote) {
    throw createHttpError(404, `Note not found`);
  }

  res.json(updateNote);
};
