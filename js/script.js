"use strict";

const body = document.querySelector("body");
const addTodo = document.querySelector(".add-todo");
const todoInput = addTodo.querySelector("input");
const todoList = document.querySelector(".todo-list"); // draggable elements container
const filterTodoBtns = document.querySelectorAll(".list-filter button");
const btnClearCompleted = document.querySelector(".btn-clear-completed");
const toggleLightMode = document.querySelector("#light-mode");
const toggleDarkMode = document.querySelector("#dark-mode");
const activeCounter = document.querySelector(".menu__summary .items-left");
let draggedElement, afterElement;
let todoAllItems = [];
let todoActiveItems = [];
let todoCompletedItems = [];
let currentListName, currentList;

const updateArray = function () {
  const movedElementIndex = draggedElement.dataset.index;
  const elementArrIndex = findArrayIndex(todoAllItems, movedElementIndex);
  let moveTo;
  if (!afterElement) {
    const beforeElement = todoList.querySelector(
      ".todo-list__item:nth-last-child(2)"
    );
    const beforeElementData = beforeElement.dataset.index;
    moveTo = findArrayIndex(todoAllItems, beforeElementData);
  } else {
    const afterElementData = afterElement.dataset.index;
    moveTo = findArrayIndex(todoAllItems, afterElementData) - 1;
  }

  todoAllItems.move(elementArrIndex, moveTo);
  console.table(todoAllItems);
};

const addItem = function (item) {
  const html =
    item === undefined
      ? `<li class="pd-600 align-center">List is empty at the moment.</li>`
      : `<li class="todo-list__item | flex-row | pd-400" data-index="${
          item.index
        }" draggable="true">
  <div>
    <input
      type="checkbox"
      class="hidden"
      name="item-${item.index}"
      id="item-${item.index}"
      ${item.completed ? "checked" : ""}
    />
    <label for="item-${item.index}">${item.activity}</label>
  </div>
  <button class="btn-remove-item">
    <span class="visually-hidden">Remove item</span
    ><img src="images/icon-cross.svg" />
  </button>
</li>`;
  todoList.insertAdjacentHTML("beforeend", html);
};

const selectTodoItems = function () {
  const items = document.querySelectorAll(".todo-list__item");
  items.forEach((item) => {
    item.addEventListener("dragstart", function () {
      this.classList.add("dragging");
    });

    item.addEventListener("dragend", function () {
      this.classList.remove("dragging");
      updateArray();
    });
  });
};

const updateTodoList = function (addNewItem = false) {
  if (currentListName === "Active") {
    currentList = todoActiveItems;
  } else if (currentListName === "Completed") {
    currentList = todoCompletedItems;
  } else {
    currentList = todoAllItems;
  }

  if (!addNewItem) {
    todoList.innerHTML = "";
    currentList.length === 0
      ? addItem()
      : currentList.forEach((item) => addItem(item));
  } else {
    if (currentList.length <= 1) todoList.innerHTML = "";
    const todoItem = currentList[currentList.length - 1];
    addItem(todoItem);
  }
  selectTodoItems();
};

// Clear input field after adding item
const clearInput = function () {
  todoInput.value = "";
};

const addNewTodo = function (e) {
  e.preventDefault();
  const todoItem = e.target[0].value;
  if (todoItem === "") return;
  todoAllItems.push({
    activity: todoItem,
    completed: false,
    index: todoAllItems.length,
  });
  clearInput();
  updateActiveCounter();
  filterLists();
  updateTodoList(true);
};

const removeTodo = function (e) {
  const target = e.target;
  if (target.tagName !== "IMG" && target.parentElement.tagName !== "BUTTON")
    return;
  const itemIndex = Number(target.closest("li").dataset.index);
  const arrayIndex = todoAllItems.findIndex((item) => item.index === itemIndex);
  todoAllItems.splice(arrayIndex, 1);
  updateActiveCounter();
  updateTodoList(false);
};

const updateItemState = function (e) {
  const currentIndex = Number(e.target.id.replace("item-", ""));
  const currentItem = todoAllItems.find((item) => item.index === currentIndex);
  currentItem.completed = !currentItem.completed;
  updateActiveCounter();
  filterLists();
  updateTodoList();
};

const resetFilterBtnStyle = function () {
  filterTodoBtns.forEach((button) => (button.dataset.currentFilter = "false"));
};

const filterLists = function () {
  todoActiveItems = todoAllItems.filter((item) => !item.completed);
  todoCompletedItems = todoAllItems.filter((item) => item.completed);
};

const updateActiveCounter = function () {
  const activeItems = todoAllItems.filter((item) => !item.completed).length;
  activeCounter.innerText = `${activeItems}`;
};

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

const findArrayIndex = function (array, index) {
  return array.findIndex((el) => el.index == index);
};

const dragAndDrop = function (e) {
  e.preventDefault();
  draggedElement = document.querySelector(".dragging");
  const otherElements = [
    ...document.querySelectorAll(".todo-list__item:not(.dragging)"),
  ];
  afterElement = otherElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = e.clientY - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;

  if (!afterElement) {
    todoList.appendChild(draggedElement);
  } else {
    todoList.insertBefore(draggedElement, afterElement);
  }
};

filterTodoBtns.forEach((button) =>
  button.addEventListener("click", function (e) {
    if (todoAllItems.length === 0) return;
    resetFilterBtnStyle();
    this.dataset.currentFilter = "true";
    currentListName = e.target.innerText;
    filterLists();
    updateTodoList();
  })
);

addTodo.addEventListener("submit", addNewTodo);
todoList.addEventListener("change", updateItemState);
todoList.addEventListener("click", removeTodo);
todoList.addEventListener("dragover", function (e) {
  dragAndDrop(e);
});

toggleLightMode.addEventListener("change", function () {
  if (this.checked) {
    body.classList.remove("dark");
  }
});

toggleDarkMode.addEventListener("change", function () {
  if (this.checked) {
    body.classList.add("dark");
  }
});
btnClearCompleted.addEventListener("click", function () {
  todoAllItems = [...todoActiveItems];
  filterLists();
  updateTodoList();
});
