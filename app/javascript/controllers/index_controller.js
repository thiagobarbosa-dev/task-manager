import { Controller } from "@hotwired/stimulus";
import * as Turbo from "@hotwired/turbo-rails";

export default class extends Controller {
  static targets = ["taskFormContainer"]

  connect() {
    // console.log("Index controller connected.");
  }

  loadEditForm(event) {
    event.preventDefault();
    event.stopPropagation();

    const taskId = event.currentTarget.dataset.indexTaskId;
    // console.log("Task card clicked. Loading edit form for task ID:", taskId);

    const editUrl = `/tasks/${taskId}/edit`;

    fetch(editUrl, {
      headers: {
        'Accept': 'text/html',
        'X-Stimulus-Fetch': 'true'
      }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    })
    .then(html => {
      this.taskFormContainerTarget.innerHTML = html;
      // console.log("Edit form loaded into container.");

      const firstInput = this.taskFormContainerTarget.querySelector("input, select, textarea");
      if (firstInput) {
          firstInput.focus();
      }
    })
    .catch(error => {
      // console.error("Failed to load edit form:", error);
      this.taskFormContainerTarget.innerHTML = `<p class='text-red-500'>Erro ao carregar formulário de edição: ${error.message}</p>`;
    });
  }

  cancelEdit(event) {
    event.preventDefault();

    // console.log("Edit cancelled. Reverting form to new task state.");

    const newUrl = `/tasks/new`;

    fetch(newUrl, {
        headers: {
           'Accept': 'text/html',
           'X-Stimulus-Fetch': 'true'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
    })
    .then(html => {
        this.taskFormContainerTarget.innerHTML = html;
        // console.log("Form reverted to new task state.");
         const firstInput = this.taskFormContainerTarget.querySelector("input, select, textarea");
         if (firstInput) {
             firstInput.focus();
         }
    })
     .catch(error => {
      //  console.error("Failed to revert form to new task state:", error);
       this.taskFormContainerTarget.innerHTML = `<p class='text-red-500'>Erro ao carregar formulário de nova tarefa: ${error.message}</p>`;
     });
  }

  deleteTask(event) {
    event.preventDefault();
    event.stopPropagation();

    const taskElement = event.currentTarget.closest(".task-list-card");
    const taskId = event.currentTarget.dataset.indexTaskId;

    if (!taskId || !taskElement) {
      // console.error("Could not determine task ID or element for deletion.");

      return;
    }

    const csrfToken = document.querySelector("meta[name='csrf-token']").content;

    if (!confirm(event.currentTarget.dataset.turboConfirm || 'Tem certeza?')) {
       return;
    }

    // console.log(`Attempting to delete task ID: ${taskId} via Stimulus fetch.`);

    fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'text/vnd.turbo-stream.html, text/html',
        'X-Stimulus-Fetch': 'true',
        'X-CSRF-Token': csrfToken
      }
    })
    .then(response => {
      if (!response.ok) {
          // console.error("Fetch error during delete:", response.status, response.statusText);

          if (response.headers.get("Content-Type")?.includes("text/html")) {

          } else {

          }
          return;
      }

      // console.log("Delete request successful. Turbo Stream response expected to handle UI update.");

      window.location.reload();
    })
    .catch(error => {
      // console.error("Network error during delete fetch:", error);
    });
  }
}