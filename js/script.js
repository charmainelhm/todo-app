"use strict";

const body = document.querySelector("body");
const addTodo = document.querySelector(".add-todo");
const todoInput = addTodo.querySelector("input");
const todoList = document.querySelector(".todo-list");
const filterTodoBtns = document.querySelectorAll(".list-filter button");
const btnClearCompleted = document.querySelector(".btn-clear-completed");
const toggleLightMode = document.querySelector("#light-mode");
const toggleDarkMode = document.querySelector("#dark-mode");
const activeCounter = document.querySelector(".menu__summary .items-left");
let todoAllItems = [];
let todoActiveItems = [];
let todoCompletedItems = [];
let currentListName, currentList;

const addItem = function (item) {
  const html =
    item === undefined
      ? `<li class="pd-600 align-center">List is empty at the moment.</li>`
      : `<li class="todo-list__item | flex-row | pd-400" data-index="${
          item.index
        }">
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
  console.log(html);
  todoList.insertAdjacentHTML("beforeend", html);
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
