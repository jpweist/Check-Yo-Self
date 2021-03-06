var taskArray = [];
var cardArray = [];
var urgentCards = [];

window.addEventListener('load', getCards)
leftBar.addEventListener('input', leftBarInputActions);
leftBar.addEventListener('click', leftBarClickActions);
contentSide.addEventListener('click', contentClickActions);
contentSide.addEventListener('keyup', keyupContent);
search.addEventListener('input', searchType);

/// RELOAD FUNCTION

function getCards() {
  if (localStorage.length > 0) {
    fromArrayLS();
    fillUrgentArray();
    cardArray.forEach(returnAllStyles);
  }
}

function returnAllStyles(element) {
  createBody(element);
  recreateChecklist(element);
  changeChecked(element);
  returnUrgent(element);
}

function recreateChecklist(card) {
  for (var i = 0; i < card.tasksId.length; i++) {
    var div = document.createElement('div');
    document.querySelector(`.task-card-${card.id}-${card.counter}__content`).appendChild(div);
    div.innerHTML = `<input id='${card.tasksId[i]}' class="checkbox" type="checkbox"><label class='label-checkbox' for="${card.tasksId[i]}"><p class='item-text' contenteditable="true" data="${i}">${card.tasks[i]}</p></label>`;
  }
}

function changeChecked(card) {
  if (card.checkedTasks.length > 0) {
    card.checkedTasks.forEach( function(element) {
      document.querySelector(`#${element}`).checked = true;
    });
  }
}

function returnUrgent(card) {
  if (card.urgent === true) addStylesForUrgent(card.counter);
}
/// *** EVENTS FUNCTION ***


function keyupContent() {
  changeTask();
  changeTitle();
}

function searchType() {
  searchTask();
  searchTitle();
}

function leftBarInputActions(event) {
  validateInputs(event.target);
  validateTaskInput(event.target);
  validateClear(event.target);
}

function leftBarClickActions(event) {
    event.preventDefault();
    if (event.target == clearAllButton) clearAllInputs();
    if (event.target.classList.contains('error-input')) clearErrorMessage();
    if (event.target == taskAddButton) createTaskList();
    if (event.target == makeCardButton) putCardToBoard();
    if (event.target.classList.contains('task-item')) removeItem(event.target);
    if (event.target == filterUrgencyButton) filterByUrgent();
}

function contentClickActions(event) {
  if (event.target.classList.contains('checkbox')) clickOnTusk(event.target);
  if (event.target.classList.contains('delete-icon')) deleteCard(event.target);
  if (event.target.classList.contains('urgent-icon')) markCardAsUrgent(event.target);
  if (event.target.classList.contains('add-task-icon')) showInputForAddNewTask(event.target);
  if (event.target.classList.contains('add-new-task-btn' || 'task-card__content')) addNewTaskToCard(event.target);
  if (event.target.classList.contains('discard-changes')) clearInputAddNewTask(event.target);
}

// *** LEFT BAR INPUT FUNCTIONS ***

function validateInputs(target) {
  let makeListVal = document.querySelector('.left-input').value.length > 0 && taskList.innerHTML != "";
  if (target.classList.contains('left-input') && makeListVal) {activateButton('make-task-list-button')} else {disableButton('make-task-list-button')};
}

function validateTaskInput(target) {
  let taskInputVal = taskInput.value.length > 0;
  if (target.classList.contains('left-input') && taskInputVal) {activateButton('add-button')} else {disableButton('add-button')};
}

function validateClear(target) {
  let clearVal = taskTitleInput.value.length > 0 || taskInput.value.length > 0 || taskList.innerHTML != "";
  if (target.classList.contains('left-input') && clearVal) {activateButton('clear-all-button')} else {disableButton('clear-all-button')};
}

// *** LEFT BAR CLICK FUNCTIONS ***
// add tasks to ToDo list
function createTaskList() {
  addToList();
  taskInput.value = "";
  activateButton('clear-all-button');
  disableButton('add-button');
  if (taskTitleInput.value.length > 0) activateButton('make-task-list-button');
}

function addToList() {
  let fullInputsVal = taskTitleInput.value != "" && taskInput.value != "";
  if (fullInputsVal) {
    pushToArray(taskArray);
    createTuskListItems(taskArray);
  }
}

function createTuskListItems(array) {
  var li = document.createElement('li');
  taskList.appendChild(li);
  li.classList.add('task-item');
  li.innerHTML = `<p class='item-text' contenteditable="true">${array[array.length - 1]}</p>`;
}

// remove tasks from ToDo list
function removeItem(target) {
  target.remove();
  var index = taskArray.indexOf(target.innerText);
  taskArray.splice(index, 1);
}

// create ToDo card
function putCardToBoard() {
  checkEmptyInputs();
  if (taskTitleInput.value != "" && taskList.innerHTML != "") {
    createTaskCard();
    clearAllInputs();
    disableLeftSideButtons();
  }
}

function createTaskCard() {
  var newCard = new ToDo({title: taskTitleInput.value});
  newCard.tasks = taskArray;
  cardArray.push(newCard);
  createBody(newCard)
  createCheckbox(newCard);
  var cardsOnBoard = document.querySelectorAll('.task-card');
  if (cardArray.length > cardsOnBoard.length) showAllCards(newCard);
  taskArray = [];
  lSArray();
}

function createBody(card) {
  var content = choosePlace(card);
  var article = document.createElement('article');
  content.appendChild(article);
  article.classList.add(`task-card`, `task-card-${card.counter}`);
  article.id = card.counter;
  article.innerHTML = defineStructure(card);
}

function defineStructure(card) {
  var cardStructure = `
  <header class="task-card__header task-card-${card.counter}__header">
        <h3 class="task-card__title" contenteditable="true" >${card.title}</h3>
      </header>
      <section class="task-card__content task-card-${card.id}-${card.counter}__content">

      </section>
      <section class="wrapper-${card.counter}"></section>
      <footer class="task-card__footer task-card-${card.counter}__footer">
        <p class="icons-name urgent-icon urgent-icon-${card.counter}">Urgent</p>
        <p class="icons-name add-task-icon add-task-icon-${card.counter}">Add task</p>
        <p class="icons-name delete-icon delete-icon-${card.counter}" >Delete</p>
      </footer>`;
  return cardStructure;
}

function choosePlace(card) {
  var content;
  var condition = columnOne.querySelectorAll('article').length > columnTwo.querySelectorAll('article').length
  if (condition) {
    content = columnTwo;
    return content;
  } else {
    content = columnOne;
    content.style.display = 'flex';
    return content;
  }
}

function createCheckbox(card) {
  for (var i = 0; i < card.tasks.length; i++) {
    var div = document.createElement('div');
    var time = Date.now();
    document.querySelector(`.task-card-${card.id}-${card.counter}__content`).appendChild(div);
    div.innerHTML = `<input id='list-${i}-${time}' class="checkbox" type="checkbox"><label class='label-checkbox' for="list-${i}-${time}"><p contenteditable="true" data="${i}" class='item-text'>${card.tasks[i]}</p></label>`;
    card.tasksId.push(`list-${i}-${time}`);
  }
}

// filter by urgency button function
function filterByUrgent() {
  var cardsOnBoard = document.querySelectorAll('article');
  if (cardArray.length === cardsOnBoard.length) keepOnlyUrgent();
  if (cardArray.length > cardsOnBoard.length) cardArray.forEach(returnAllCards);
}

function keepOnlyUrgent() {
  cardArray.forEach(function(element) {
    if (element.urgent != true) {
      document.querySelector(`.task-card-${element.counter}`).remove();
    }
    filterUrgencyButton.classList.add('urgent-active');
    checkColumnOne();
  })
}

function returnAllCards(element) {
  if (element.urgent === false) {
    columnOne.style.display = 'flex'
    createBody(element);
    recreateChecklist(element);
    changeChecked(element);
    filterUrgencyButton.classList.remove('urgent-active');
  }
}

function showAllCards(card) {
  var newI = card.counter - 1;
  var unurgent = [];
  for (var i = 0; i < newI; i++) {
    if (cardArray[i].urgent === false) unurgent.push(cardArray[i]);
  }
  unurgent.forEach(returnAllStyles);
  filterUrgencyButton.classList.remove('urgent-active');
}

// *** CONTENT SIDE ACTION FUNCTIONS ***
function changeTask() {
  if (event.target.classList.contains('item-text')) {
  for (i = 0; i < cardArray.length; i++) {
    if (parseInt(event.target.closest('article').id) === cardArray[i].counter) {
      cardArray[i].tasks[event.target.getAttribute('data')] = event.target.innerHTML;
      lSArray();
    }
  }
  }
}

  function changeTitle() {
    if (event.target.classList.contains('task-card__title')) {
    for (i = 0; i < cardArray.length; i++) {
      if (parseInt(event.target.closest('article').id) === cardArray[i].counter) {
        cardArray[i].title = event.target.innerHTML;
        lSArray();
      }
    }
    }
  }


function clickOnTusk(target) {
  var card = findCard(target);
  if (card.checkedTasks.length === 0 || !card.checkedTasks.includes(`${target.id}`)) {
    card.checkedTasks.push(target.id);
  } else {
    var index = card.checkedTasks.indexOf(target.id);
    card.checkedTasks.splice(index, 1);
  }
  card.checkAllChecked();
  lSArray();
}

// delete cards functions
function deleteCard(target) {
    var card = findCard(target);
    var index = card.counter - 1;
    deleteCardFromBoardAndArray(target, card, index);
    if (cardArray.length === 0) localStorage.clear();
    checkColumnOne();
}

function deleteCardFromBoardAndArray(target, card, index) {
  if (card.allChecked) {
    target.closest('article').remove();
    cardArray.splice(index, 1);
    if (card.urgent === true) deleteUrgent(card.counter);
    renewCards(index);
    lSArray();
    if (urgentCards.length === 0) filterUrgencyButton.classList.remove('urgent-active');
  }
}

function renewCards(indexOfCard) {
  for (var i = indexOfCard; i < cardArray.length; i++) {
    var card = cardArray[i];
    var oldCounter = card.counter;
    var newCounter = oldCounter - 1;
    renewBody(card, oldCounter, newCounter);
    card.counter = newCounter;
  }
  lSArray();
}

function renewBody(card, oldCounter, newCounter) {
  replaceClass(`task-card-${oldCounter}`, `task-card-${newCounter}`);
  document.querySelector(`.task-card-${newCounter}`).id = newCounter;
  replaceClass(`task-card-${oldCounter}__header`, `task-card-${newCounter}__header`);
  replaceClass(`task-card-${card.id}-${oldCounter}__content`, `task-card-${card.id}-${newCounter}__content`);
  replaceClass(`task-card-${oldCounter}__footer`, `task-card-${newCounter}__footer`);
  replaceClass(`urgent-icon-${oldCounter}`, `urgent-icon-${newCounter}`);
  replaceClass(`delete-icon-${oldCounter}`, `delete-icon-${newCounter}`);
}

// make card urgent functions
function markCardAsUrgent(target) {
  var card = findCard(target);
  if (target.classList.contains('urgent-active-icon') && card.urgent === true) {
    makeRegular(card)
  } else {
    makeUrgent(target, card);
  }
  lSArray();
}

function makeUrgent(target, card) {
  if (target.classList.contains('urgent-icon') && card.urgent === false) {
    urgentCards.push(Number(target.closest('article').id));
    addStylesForUrgent(card.counter);
    card.updateToDo();
  }
}

function makeRegular(card) {
  removeStylesForUrgent(card.counter);
  card.updateToDo();
  deleteUrgent(card.counter);
}

function addStylesForUrgent(counter) {
  addItemClass(`.task-card-${counter}`, 'task-card--urgent');
  addItemClass(`.task-card-${counter}__header`, 'border--urgent');
  addItemClass(`.task-card-${counter}__footer`, 'border--urgent');
  addItemClass(`.urgent-icon-${counter}`, 'urgent-active-icon');
}

function removeStylesForUrgent(counter) {
  removeItemClass(`.task-card-${counter}`, 'task-card--urgent');
  removeItemClass(`.task-card-${counter}__header`, 'border--urgent');
  removeItemClass(`.task-card-${counter}__footer`, 'border--urgent');
  removeItemClass(`.urgent-icon-${counter}`, 'urgent-active-icon');
}

// Search Functions

function searchTitle() {
  if (document.getElementById('search-type').value === 'title' || document.getElementById('search-type').value === 'all') {
    for (var i = 0; i < cardArray.length; i++) {
        if (cardArray[i].title.includes(document.getElementById('search-input').value) != true) {
          var id = cardArray[i].counter;
          document.getElementById(`${id}`).classList.add('hidden');
        } else {
          var id = cardArray[i].counter;
          document.getElementById(`${id}`).classList.remove('hidden')
        }
    }
  }
}

function searchTask() {
  if (document.getElementById('search-type').value === 'task' || document.getElementById('search-type').value === 'all') {
  for (var i = 0; i < cardArray.length; i++) {
    for ( var k = 0;  k < cardArray[i].tasks.length; k++) {
      if (cardArray[i].tasks[k].includes(document.getElementById('search-input').value) != true) {
        var id = cardArray[i].counter;
        document.getElementById(`${id}`).classList.add('hidden')
      }
    }
    for ( var k = 0;  k < cardArray[i].tasks.length; k++) {
      if (cardArray[i].tasks[k].includes(document.getElementById('search-input').value) === true) {
        var id = cardArray[i].counter;
        document.getElementById(`${id}`).classList.remove('hidden')
      }
    }
 }
}
}

// Add new task to card
function showInputForAddNewTask(target) {
  var card = findCard(target);
  var parent = document.querySelector(`.wrapper-${card.counter}`);
  var input = document.createElement('div');
  chooseActionForAddTaskBtn(parent, input, card);
}

function chooseActionForAddTaskBtn(parent, input, card) {
  if (document.querySelectorAll(`.input-wrapper-${card.counter}`).length < 1) {
    createNewTaskInput(parent, input, card);
  } else {
    hideNewTaskInput(card)
  }
}

function createNewTaskInput(parent, input, card) {
  parent.appendChild(input);
  input.classList.add('input-wrapper',`input-wrapper-${card.counter}`);
  input.innerHTML = `
    <input id='add-new-task' class='add-new-task add-new-task-${card.counter}' type="text">
    <button class='new-task-btn add-new-task-btn add-new-task-btn-${card.counter}'></button>
    <button class='new-task-btn discard-changes discard-changes-btn-${card.counter}'></button>`
  document.querySelector(`.add-task-icon-${card.counter}`).classList.add('add-task-active-icon');
}

function hideNewTaskInput(card) {
  document.querySelector(`.input-wrapper-${card.counter}`).remove();
  document.querySelector(`.add-task-icon-${card.counter}`).classList.remove('add-task-active-icon');
}

function addNewTaskToCard(target) {
  var card = findCard(target);
  var newTask = document.querySelector(`.add-new-task-${card.counter}`).value;
  if (newTask != "") createBodyForOneNewTask(newTask, card);
  lSArray();
  resetForm(target, card);
}

function createBodyForOneNewTask(newTask, card) {
  var div = document.createElement('div');
  var time = Date.now();
  document.querySelector(`.task-card-${card.id}-${card.counter}__content`).appendChild(div);
  div.innerHTML = `<input id='list-${card.tasks.length}-${time}' class="checkbox" type="checkbox"><label class='label-checkbox' for="list-${card.tasks.length}-${time}"><p class='item-text' contenteditable="true">${newTask}</p></label>`;
  card.tasks.push(newTask);
  card.tasksId.push(`list-${card.tasks.length}-${time}`);
}
// *** CLEAR FUNCTIONS ***

function clearAllInputs() {
  taskList.innerHTML = "";
  taskTitleInput.value = "";
  taskInput.value = "";
  disableLeftSideButtons();
  taskArray = [];
}

function clearInput(input) {
  document.querySelector(`#${input}`).value = "";
}

function clearInputAddNewTask(target) {
  var card = findCard(target);
  document.querySelector(`.add-new-task-${card.counter}`).value = "";
}

function resetForm(target, card) {
  target.closest(`.input-wrapper-${card.counter}`).remove();
  document.querySelector(`.add-task-icon-${card.counter}`).classList.remove('add-task-active-icon');
}

// *** DISABLE AND ACTIVATE BUTTON FUNCTIONS ***

function activateButton(button) {
  document.querySelector(`.${button}`).disabled = false;
}

function disableButton(button) {
  document.querySelector(`.${button}`).disabled = true;
}

function disableLeftSideButtons() {
  var buttons = [taskPlusButton , makeCardButton, clearAllButton];
  buttons.forEach(function(element) {element.disabled = true});
}

// *** ERROR FUNCTIONS ***

function checkEmptyInputs() {
  if (taskTitleInput.value === "" || taskList.innerHTML === "") showError();
}

function showError() {
  addItemClass('#task-title', 'error-input');
  addItemClass('#task-input', 'error-input');
  error.style.display = 'block';
}

function clearErrorMessage() {
  removeItemClass('#task-title', 'error-input');
  removeItemClass('#task-input', 'error-input');
  error.style.display = 'none';
}

// *** OTHER HELPING FUNCTIONS ***
// put array to localStorage
function lSArray() {
  if (cardArray != 0) {
  localStorage.setItem('array',JSON.stringify(cardArray));
  }
}

// take value from localStorage
function fromArrayLS() {
  var array = JSON.parse(localStorage.getItem('array'));
  var instances = [];
  for (var i = 0; i < array.length; i++) {
    var card = new ToDo(array[i]);
    instances.push(card)
  }
  cardArray = instances;
}

// array operations
function pushToArray(array) {
  var value = document.getElementById('task-input').value;
  array.push(value);
}

function fillUrgentArray() {
  for (var i = 0; i < cardArray.length; i++) {
    if (cardArray[i].urgent === true) urgentCards.push(cardArray[i]);
  }
  if (urgentCards.length > 0) filterUrgencyButton.disabled = false;
}

// element class operations
function addItemClass(item, classItem) {
  document.querySelector(`${item}`).classList.add(`${classItem}`);
}

function removeItemClass(item, classItem) {
  document.querySelector(`${item}`).classList.remove(`${classItem}`);
}

function replaceClass(oldClass, newClass) {
  document.querySelector(`.${oldClass}`).classList.replace(oldClass, newClass);
}

// column display function
function checkColumnOne() {
  if (columnOne.innerHTML == "") columnOne.style.display = "none";
}

// find card
function findCard(target) {
  var counter = Number(target.closest('article').id);
  var indexOfCard = cardArray.findIndex(x=>x.counter === counter);
  var card = cardArray[indexOfCard];
  return card;
}

// delete from urgent array
function deleteUrgent(value) {
  urgentCards.splice(urgentCards.indexOf(value), 1);
}
