import { Controller } from "@hotwired/stimulus";
import * as Turbo from "@hotwired/turbo-rails";

export default class extends Controller {
  static targets = ["title", "category", "itemsContainer", "itemRow", "newItem", "newItemRow", "form"]

  connect() {
    console.log("Task form controller connected");
    if (this.hasTitleTarget && !this.titleTarget.value) {
      this.titleTarget.focus();
    }
  }

  preventFormSubmitOnEnter(event) {
     if (event.key === "Enter") {

        if (event.target !== this.newItemTarget) {
           event.preventDefault();
          //  console.log(`Prevented form submit on Enter from field: ${event.target.name || event.target.tagName}`);
        }
     }
  }


  handleNewItemKeydown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      
      if (event.target.value.trim() !== "") {
          this.addNewItem();
      } else {
        //  console.log("Enter pressed on empty new item field. Submit prevented.");
      }
      return false;
    }
  }

  handleItemKeydown(event) {
      const input = event.target
      
      if (event.key === "Enter") {
          event.preventDefault()
          event.stopPropagation();

          if (this.hasNewItemTarget) {
              this.newItemTarget.focus();
          }
          return false;
      }

      if (event.key === "Backspace" && input.value === "") {
          event.preventDefault();
          event.stopPropagation();

          const row = input.closest(".task-item-row");
          if (!row) return;

          let targetElementToFocus = null;
          const prevRow = row.previousElementSibling;
          if (prevRow && prevRow.classList.contains("task-item-row")) {
              targetElementToFocus = prevRow.querySelector("input[type='text']");
          } else if (this.hasNewItemTarget) {
              targetElementToFocus = this.newItemTarget;
          }

          const removeButton = row.querySelector('button[data-action="click->task-form#removeItem"]');
          if (removeButton) {
              this.removeItem({ currentTarget: removeButton });
          } else {
               row.remove();
          }

          if (targetElementToFocus) {
              targetElementToFocus.focus();
              if (targetElementToFocus.type === "text") {
                  const length = targetElementToFocus.value.length;
                  targetElementToFocus.setSelectionRange(length, length);
              }
          }
          return false;
      }
  }


  addNewItem() {
    const newItemValue = this.newItemTarget.value.trim();
    if (newItemValue === "") return;

    const newRow = document.createElement("div");
    newRow.className = "task-item-row flex items-center mb-2";
    newRow.dataset.taskFormTarget = "itemRow";

    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "flex-shrink-0 mr-2";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500";
    checkbox.dataset.action = "change->task-form#toggleItemStatus";
    checkboxContainer.appendChild(checkbox);

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = `task[task_items_attributes][][title]`; // Notação de array
    textInput.value = newItemValue;
    textInput.className = "flex-grow text-sm border-none focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700";
    textInput.dataset.action = "keydown->task-form#handleItemKeydown";

    const statusInput = document.createElement("input");
    statusInput.type = "hidden";
    statusInput.name = `task[task_items_attributes][][status]`; // Notação de array
    statusInput.value = "pending";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "ml-2 text-gray-400 hover:text-gray-600";
    removeButton.dataset.action = "click->task-form#removeItem";
    removeButton.innerHTML = `
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;

    newRow.appendChild(checkboxContainer);
    newRow.appendChild(textInput);
    newRow.appendChild(statusInput);
    newRow.appendChild(removeButton);

    this.itemsContainerTarget.insertBefore(newRow, this.newItemRowTarget);

    this.newItemTarget.value = "";
  }

  removeItem(event) {
    const row = event.currentTarget ? event.currentTarget.closest(".task-item-row") : event;
    if (!row) {
        // console.error("Could not find item row to remove.");
        return;
    }

    // console.log(`Attempting to remove item row: ${row.id || row}`);

    const idInput = row.querySelector("input[name*='[id]']");
    if (idInput && this.hasItemsContainerTarget) {
        const existingItemId = idInput.value;
        if (existingItemId) {
            const destroyInput = document.createElement("input");
            destroyInput.type = "hidden";
            const nameMatch = idInput.name.match(/task\[task_items_attributes\]\[([^\]]+)\]\[id\]/);
            if (nameMatch && nameMatch[1]) {
              const index = nameMatch[1];
              destroyInput.name = `task[task_items_attributes][${index}][_destroy]`;
              destroyInput.value = "1";
              this.formTarget.appendChild(destroyInput);
              // console.log(`Marked item with index "${index}" (ID: ${existingItemId}) for destruction.`);
            } else {
              //  console.error("Could not parse index from item ID input name:", idInput.name);
            }
        } else {
            // console.warn("Item has an ID input but the value is empty. Assuming unsaved item.");
        }
    } else {
        // console.log("Item is new (no ID input) or itemsContainerTarget not found. Will just remove from DOM.");
    }

    row.remove();
    // console.log("Item row removed from DOM.");
  }


  toggleItemStatus(event) {
    const checkbox = event.currentTarget;
    const row = checkbox.closest(".task-item-row");
    if (!row) {
        // console.error("Could not find item row for status toggle.");
        return;
    }

    const textInput = row.querySelector("input[type='text']");
    const statusInput = row.querySelector("input[type='hidden'][name$='[status]']");

    if (textInput && statusInput) {
      if (checkbox.checked) {
        textInput.classList.add("line-through", "text-gray-400");
        textInput.classList.remove("text-gray-700");
        statusInput.value = "completed";
      } else {
        textInput.classList.remove("line-through", "text-gray-400");
        textInput.classList.add("text-gray-700");
        statusInput.value = "pending";
      }
      //  console.log(`Item status toggled to: ${statusInput.value} for item row: ${row.id || row}`);

    } else {
      console.error("Text input or status input not found in item row for toggle status.");
    }
  }


  submit(event) {
    event.preventDefault();
    // console.log("Submit event intercepted by Stimulus controller. Preventing default submit.");

    if (this.hasNewItemTarget && this.newItemTarget.value.trim() !== "") {
      this.addNewItem();
      // console.log("Added pending new item from input field before submitting.");
    }

    if (this.hasTitleTarget && !this.titleTarget.value.trim()) {
      // console.log("Title is empty. Cannot submit.");
      this.titleTarget.classList.add("border", "border-red-500");
      this.titleTarget.focus();
      return;
    } else if (this.hasTitleTarget) {
      this.titleTarget.classList.remove("border", "border-red-500");
    }

    const form = this.formTarget;
    const formData = new FormData(form);
    // console.log("--- Form Data collected for submission: ---");
    let hasItemAttributes = false;
    for (let pair of formData.entries()) {
      // console.log(pair[0] + ': ' + pair[1]);
      if (pair[0].startsWith('task[task_items_attributes]')) {
        hasItemAttributes = true;
      }
    }
    
    if (this.hasFormTarget) {
      // console.log("Validation successful. Submitting form normally...");
      form.submit();
    } else {
      // console.error("Form target not found. Cannot submit form.");
    }
  }
}
