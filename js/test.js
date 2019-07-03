'use strict';

const createListItem = ({id, body}) => {
  const listItem = document.createElement('li');
  listItem.classList.add('list-item');
  listItem.dataset.id = id;

  const text = document.createElement('p');
  text.classList.add('text');
  text.textContent = body;

  const actionsContainer = document.createElement('div');
  actionsContainer.classList.add('actions');

  const editButton = document.createElement('button');
  editButton.classList.add('btn');
  editButton.textContent = 'Edit';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn');
  deleteButton.textContent = 'Delete';

  actionsContainer.appendChild(editButton);
  actionsContainer.appendChild(deleteButton);

  listItem.appendChild(text);
  listItem.appendChild(actionsContainer);

  return listItem;
};

const renderListItems = (parent, obj) => {
  const listItems = obj.map(item => createListItem(item));
  parent.append(...listItems);
};

const list = document.querySelector('.list');

renderListItems(list, data);
