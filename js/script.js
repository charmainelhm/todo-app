"use strict";

const addTodo = document.querySelector(".add-todo");
const todoInput = addTodo.querySelector("input");
const todoList = document.querySelector(".todo-list");
const todoListItems = [];

const addItem = function (item) {
  const html = `<li class="todo-list__item | flex-row | pd-400" data-index="${item.index}">
  <div>
    <input
      type="checkbox"
      class="hidden"
      name="item-${item.index}"
      id="item-${item.index}"
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

const updateTodoList = function (addNewItem, array = todoListItems) {
  if (addNewItem) {
    const todoItem = array[array.length - 1];
    addItem(todoItem);
  } else {
    todoList.innerHTML = "";
    array.forEach((item) => addItem(item));
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

addTodo.addEventListener("submit", addNewTodo);
todoList.addEventListener("change", updateItemState);
todoList.addEventListener("click", removeTodo);
