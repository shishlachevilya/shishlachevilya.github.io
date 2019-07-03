'use strict';

class Notepad {

  constructor(parent, arr) {
    this._notes = arr;
    this._parent = parent;
  };

  get notes() {
    return this._notes;
  };

  findNoteById(id) {
    const note = this._notes.find(item => item.id === id);

    return note;
  };

  saveNote(note) {
    this._notes.push(note);

    return note;
  };

  deleteNote(id) {
    this._notes = this._notes.filter(note => note.id !== id);
  };

  updateNoteContent(id, updatedContent) {
    const note = this.findNoteById(id);

    if (!note) return;

    return Object.assign(note, updatedContent);
  };

  updateNotePriority(id, priority) {
    const note = this.findNoteById(id);

    if (!note) return;

    note.priority = priority;

    return note;
  };

  filterNotesByQuery(query) {
    const queryArray = [];

    for (const key in this._notes) {
      if (this._notes[key].title.toLowerCase().includes(query.toLowerCase()) || this._notes[key].body.toLowerCase().includes(query.toLowerCase())) {
        queryArray.push(this._notes[key]);
      }
    }

    return queryArray;
  };

  filterNotesByPriority(priority) {
    const priorityArray = this._notes.filter(note => note.priority === priority);

    return priorityArray;
  };

  createButton = (action, type) => {
    const button = document.createElement('button');
    button.classList.add('action');
    button.dataset.action = action;

    const icon = document.createElement('i');
    icon.classList.add('material-icons', 'action__icon');
    icon.textContent = type;
    button.appendChild(icon);

    return button;
  };

  createNoteContent = (title, body) => {
    const noteContent = document.createElement('div');
    noteContent.classList.add('note__content');

    const noteTitle = document.createElement('h2');
    noteTitle.classList.add('note__title');
    noteTitle.textContent = title;

    const noteBody = document.createElement('p');
    noteBody.classList.add('note__body');
    noteBody.textContent = body;

    noteContent.append(noteTitle, noteBody);

    return noteContent;
  };

  createNotePriority = (priority) => {
    const notePriority = document.createElement('span');
    notePriority.classList.add('note__priority');
    notePriority.textContent = 'Priority: ' + priority;

    return notePriority;
  };

  createNoteSection = (btn1, btn2, span = '') => {
    const noteSection = document.createElement('section');
    noteSection.classList.add('note__section');

    noteSection.append(btn1, btn2, span);

    return noteSection;
  };

  createNoteFooter = (priority) => {
    const noteFooter = document.createElement('footer');
    noteFooter.classList.add('note__footer');

    const btnDown = this.createButton(NOTE_ACTIONS.DECREASE_PRIORITY, ICON_TYPES.ARROW_DOWN);
    const btnUp = this.createButton(NOTE_ACTIONS.INCREASE_PRIORITY, ICON_TYPES.ARROW_UP);
    const btnEdit = this.createButton(NOTE_ACTIONS.EDIT, ICON_TYPES.EDIT);
    const btnDelete = this.createButton(NOTE_ACTIONS.DELETE, ICON_TYPES.DELETE);
    const notePriority = this.createNotePriority(priority);

    const sectionLeft = this.createNoteSection(btnDown, btnUp, notePriority)
    const sectionRight = this.createNoteSection(btnEdit, btnDelete);

    noteFooter.append(sectionLeft, sectionRight);
    return noteFooter;
  };

  createListItem = ({ id, title, body, priority }) => {
    const listItem = document.createElement('li');
    listItem.classList.add('note-list__item');
    listItem.dataset.id = id;

    const note = document.createElement('div');
    note.classList.add('note');

    const content = this.createNoteContent(title, body);
    const footer = this.createNoteFooter(priority);

    note.append(content, footer);
    listItem.appendChild(note);
    return listItem;
  };

  renderListItem = () => {
    const listItem = this._notes.map(item => this.createListItem(item));
    this._parent.append(...listItem);
  };
}

const PRIORITY_TYPES = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
};

const ICON_TYPES = {
  EDIT: 'edit',
  DELETE: 'delete',
  ARROW_DOWN: 'expand_more',
  ARROW_UP: 'expand_less',
};

const NOTE_ACTIONS = {
  DELETE: 'delete-note',
  EDIT: 'edit-note',
  INCREASE_PRIORITY: 'increase-priority',
  DECREASE_PRIORITY: 'decrease-priority',
};

const initialNotes = [
  {
    id: 'id-1',
    title: 'JavaScript essentials',
    body:
      'Get comfortable with all basic JavaScript concepts: variables, loops, arrays, branching, objects, functions, scopes, prototypes etc',
    priority: PRIORITY_TYPES.HIGH,
  },
  {
    id: 'id-2',
    title: 'Refresh HTML and CSS',
    body:
      'Need to refresh HTML and CSS concepts, after learning some JavaScript. Maybe get to know CSS Grid and PostCSS, they seem to be trending.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-3',
    title: 'Get comfy with Frontend frameworks',
    body:
      'First should get some general knowledge about frameworks, then maybe try each one for a week or so. Need to choose between React, Vue and Angular, by reading articles and watching videos.',
    priority: PRIORITY_TYPES.NORMAL,
  },
  {
    id: 'id-4',
    title: 'Winter clothes',
    body:
      "Winter is coming! Need some really warm clothes: shoes, sweater, hat, jacket, scarf etc. Maybe should get a set of sportwear as well so I'll be able to do some excercises in the park.",
    priority: PRIORITY_TYPES.LOW,
  },
];

const noteList = document.querySelector('.note-list');
const notepad = new Notepad(noteList, initialNotes);

notepad.renderListItem();
