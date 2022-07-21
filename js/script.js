"use strict";

const addTodo = document.querySelector(".add-todo");
const todoInput = addTodo.querySelector("input");
const todoList = document.querySelector(".todo-list");
const filterTodoBtns = document.querySelectorAll(".list-filter button");
const todoListItems = [];
let todoActiveItems = [];
let todoCompletedItems = [];
let currentList = todoListItems;

const addItem = function (item) {
  const html = `<li class="todo-list__item | flex-row | pd-400" data-index="${
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

  todoList.insertAdjacentHTML("beforeend", html);
};

const updateTodoList = function (addNewItem = false) {
  if (!addNewItem) {
    todoList.innerHTML = "";
    currentList.forEach((item) => addItem(item));
  } else {
    const todoItem = currentList[currentList.length - 1];
    addItem(todoItem);
  }
};

const clearInput = function () {
  todoInput.value = "";
};

const addNewTodo = function (e) {
  e.preventDefault();
  const todoItem = e.target[0].value;
  if (todoItem === "") return;
  todoListItems.push({
    activity: todoItem,
    completed: false,
    index: todoListItems.length,
  });
  clearInput();
  updateTodoList(true);
};

const removeTodo = function (e) {
  const target = e.target;
  if (target.tagName !== "IMG" && target.parentElement.tagName !== "BUTTON")
    return;
  const itemIndex = Number(target.closest("li").dataset.index);
  const arrayIndex = todoListItems.findIndex(
    (item) => item.index === itemIndex
  );
  todoListItems.splice(arrayIndex, 1);
  updateTodoList(false);
};

const updateItemState = function (e) {
  const currentIndex = Number(e.target.id.replace("item-", ""));
  const currentItem = todoListItems.find((item) => item.index === currentIndex);
  currentItem.completed = !currentItem.completed;
};

const resetFilterBtnStyle = function () {
  filterTodoBtns.forEach((button) => (button.dataset.currentFilter = "false"));
};

filterTodoBtns.forEach((button) =>
  button.addEventListener("click", function (e) {
    resetFilterBtnStyle();
    this.dataset.currentFilter = "true";
    const filterType = e.target.innerText;

    if (filterType === "Active") {
      todoActiveItems = todoListItems.filter((item) => !item.completed);
      currentList = todoActiveItems;
      updateTodoList();
    }

    if (filterType === "Completed") {
      todoCompletedItems = todoListItems.filter((item) => item.completed);
      currentList = todoCompletedItems;
      updateTodoList();
    }

    if (filterType === "All") {
      currentList = todoListItems;
      updateTodoList();
    }
  })
);

addTodo.addEventListener("submit", addNewTodo);
todoList.addEventListener("change", updateItemState);
todoList.addEventListener("click", removeTodo);
