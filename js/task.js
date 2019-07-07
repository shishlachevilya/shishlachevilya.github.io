'use strict';

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

class Notepad {

  constructor(arr = []) {
    this._notes = arr;
  };

  static generateUniqueId() {
    const noteId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return noteId;
  }

  get notes() {
    return this._notes;
  };

  findNoteById(id) {
    const note = this._notes.find(item => item.id === id);

    return note;
  };

  saveNote(title, text) {
    const newItem = {
      id: Notepad.generateUniqueId(),
      title: title,
      body: text,
      priority: PRIORITY_TYPES.LOW
    };

    this._notes.push(newItem);

    return newItem;
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
    return this._notes.filter(note => note.body.toLowerCase().includes(query.toLowerCase()));
  };

  filterNotesByPriority(priority) {
    const priorityArray = this._notes.filter(note => note.priority === priority);

    return priorityArray;
  };
}

// Refs
const refs = {
  form: document.querySelector('.note-editor'),
  noteList: document.querySelector('.note-list'),
  searchInput: document.querySelector('.search-form__input')
};

const notepad = new Notepad(initialNotes);

// UI
const createButton = (action, type) => {
  const button = document.createElement('button');
  button.classList.add('action');
  button.dataset.action = action;

  const icon = document.createElement('i');
  icon.classList.add('material-icons', 'action__icon');
  icon.textContent = type;
  button.appendChild(icon);

  return button;
};

const createNoteContent = (title, body) => {
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

const createNotePriority = (priority) => {
  const notePriority = document.createElement('span');
  notePriority.classList.add('note__priority');
  notePriority.textContent = 'Priority: ' + priority;

  return notePriority;
};

const createNoteSection = (btn1, btn2, span = '') => {
  const noteSection = document.createElement('section');
  noteSection.classList.add('note__section');

  noteSection.append(btn1, btn2, span);

  return noteSection;
};

const createNoteFooter = (priority) => {
  const noteFooter = document.createElement('footer');
  noteFooter.classList.add('note__footer');

  const btnDown = createButton(NOTE_ACTIONS.DECREASE_PRIORITY, ICON_TYPES.ARROW_DOWN);
  const btnUp = createButton(NOTE_ACTIONS.INCREASE_PRIORITY, ICON_TYPES.ARROW_UP);
  const btnEdit = createButton(NOTE_ACTIONS.EDIT, ICON_TYPES.EDIT);
  const btnDelete = createButton(NOTE_ACTIONS.DELETE, ICON_TYPES.DELETE);
  const notePriority = createNotePriority(priority);

  const sectionLeft = createNoteSection(btnDown, btnUp, notePriority)
  const sectionRight = createNoteSection(btnEdit, btnDelete);

  noteFooter.append(sectionLeft, sectionRight);
  return noteFooter;
};

const createListItem = ({id, title, body, priority}) => {
  const listItem = document.createElement('li');
  listItem.classList.add('note-list__item');
  listItem.dataset.id = id;

  const note = document.createElement('div');
  note.classList.add('note');

  const content = createNoteContent(title, body);
  const footer = createNoteFooter(priority);

  note.append(content, footer);
  listItem.appendChild(note);
  return listItem;
};

const renderListItem = (parent, items) => {
  const listItem = items.map(item => createListItem(item));
  parent.innerHTML = '';
  parent.append(...listItem);
};

const addItemToList = (parent, item) => {
  const listItem = createListItem(item);

  parent.appendChild(listItem);
};

renderListItem(refs.noteList, initialNotes);

// Handlers
const handleEditorSubmit = event => {
  event.preventDefault();
  const [input, area] = event.target.elements;

  if (input.value === '' || area.value === '') {
    alert('Необходимо заполнить все поля!');
    return;
  }

  const savedItem = notepad.saveNote(input.value, area.value);

  addItemToList(refs.noteList, savedItem);

  event.currentTarget.reset();
};

const handleRemoveListItem = event => {
  const target = event.target;

  switch (target.parentNode.dataset.action) {
    case 'delete-note':
      const currentItemId = target.closest('.note-list__item').dataset.id;

      notepad.deleteNote(currentItemId);
      target.closest('.note-list__item').remove();
      break;
    case 'edit-note':
      console.log('edit');
      break;
    case 'decrease-priority':
      console.log('down');
      break;
    case 'increase-priority':
      console.log('up');
      break;
    default:
      console.log('default');
  }
};

const handleFilterChange = event => {
  const filteredItems = notepad.filterNotesByQuery(event.target.value);
  renderListItem(refs.noteList, filteredItems);
};

// Events
refs.form.addEventListener('submit', handleEditorSubmit);
refs.noteList.addEventListener('click', handleRemoveListItem);
refs.searchInput.addEventListener('input', handleFilterChange);
