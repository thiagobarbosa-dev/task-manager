// app/javascript/controllers/task_form_controller.js
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

  // Removida a ação keydown no formulário HTML. O handle está aqui.
  // Essa função previne o submit do formulário quando Enter é pressionado em qualquer campo
  // EXCEPT where we handle it specifically (like handleNewItemKeydown)
  preventFormSubmitOnEnter(event) {
     if (event.key === "Enter") {
        // Verifique se o target não é o campo de novo item, onde temos tratamento específico
        if (event.target !== this.newItemTarget) {
           event.preventDefault();
           console.log(`Prevented form submit on Enter from field: ${event.target.name || event.target.tagName}`);
        }
     }
  }


  handleNewItemKeydown(event) {
    // Se pressionar Enter e o campo não estiver vazio
    if (event.key === "Enter") {
      event.preventDefault(); // Impedir o comportamento padrão (incluindo potencial submit)
      event.stopPropagation(); // Impedir que o evento burbulhe para o formulário
      
      if (event.target.value.trim() !== "") {
          this.addNewItem();
          // Opcional: Limpar e manter o foco no campo de novo item para adicionar múltiplos rapidamente
          // this.newItemTarget.value = ""; // addNewItem já faz isso
          // this.newItemTarget.focus(); // Mantém o foco
      } else {
         // Se Enter em campo vazio, apenas previne o submit e não faz mais nada.
         console.log("Enter pressed on empty new item field. Submit prevented.");
      }
      return false; // Explicitamente retornar false para garantir
    }
    // Para outras teclas, o evento segue normal.
  }

  handleItemKeydown(event) {
      const input = event.target
      
      // Se pressionar Enter em qualquer item existente
      if (event.key === "Enter") {
          event.preventDefault() // Impedir o comportamento padrão
          event.stopPropagation(); // Impedir que o evento burbulhe para o formulário
          // Focar no campo de novo item após Enter
          if (this.hasNewItemTarget) {
              this.newItemTarget.focus();
          }
          return false;
      }

      // Se pressionar Backspace em um campo vazio
      if (event.key === "Backspace" && input.value === "") {
          event.preventDefault();
          event.stopPropagation();

          const row = input.closest(".task-item-row");
          if (!row) return;

          // Encontrar o item anterior ou o campo de novo item
          let targetElementToFocus = null;
          const prevRow = row.previousElementSibling;
          if (prevRow && prevRow.classList.contains("task-item-row")) {
              targetElementToFocus = prevRow.querySelector("input[type='text']");
          } else if (this.hasNewItemTarget) {
              targetElementToFocus = this.newItemTarget;
          }

          // Remover o item atual (marca para _destroy se tiver ID)
          // Encontre o botão remover dentro da linha para chamar a função existente
          const removeButton = row.querySelector('button[data-action="click->task-form#removeItem"]');
          if (removeButton) {
              this.removeItem({ currentTarget: removeButton });
          } else {
              // Se não encontrou o botão (talvez um item recém-adicionado sem ID), apenas remove a linha
               row.remove();
          }


          // Focar no elemento encontrado
          if (targetElementToFocus) {
              targetElementToFocus.focus();
              // Se focou em um campo de texto, mover cursor para o final
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

    // Criar nova linha de item
    const newRow = document.createElement("div");
    newRow.className = "task-item-row flex items-center mb-2";
    newRow.dataset.taskFormTarget = "itemRow";

    // Checkbox
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "flex-shrink-0 mr-2";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500";
    checkbox.dataset.action = "change->task-form#toggleItemStatus";
    checkboxContainer.appendChild(checkbox);

    // Campo de texto - USANDO NOTAÇÃO DE ARRAY
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.name = `task[task_items_attributes][][title]`; // Notação de array
    textInput.value = newItemValue;
    textInput.className = "flex-grow text-sm border-none focus:outline-none focus:ring-0 placeholder-gray-400 text-gray-700";
    textInput.dataset.action = "keydown->task-form#handleItemKeydown";

    // Campo oculto para status - USANDO NOTAÇÃO DE ARRAY
    const statusInput = document.createElement("input");
    statusInput.type = "hidden";
    statusInput.name = `task[task_items_attributes][][status]`; // Notação de array
    statusInput.value = "pending";

    // Botão de remover
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "ml-2 text-gray-400 hover:text-gray-600";
    removeButton.dataset.action = "click->task-form#removeItem";
    removeButton.innerHTML = `
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;

    // Montar a linha
    newRow.appendChild(checkboxContainer);
    newRow.appendChild(textInput);
    newRow.appendChild(statusInput);
    newRow.appendChild(removeButton);

    // Inserir antes da linha de novo item
    this.itemsContainerTarget.insertBefore(newRow, this.newItemRowTarget);

    // Limpar o campo de novo item
    this.newItemTarget.value = "";
  }


  removeItem(event) {
    // Assume event.currentTarget é o botão de remover, ou o elemento a ser removido se chamado internamente
    const row = event.currentTarget ? event.currentTarget.closest(".task-item-row") : event;
    if (!row) {
        console.error("Could not find item row to remove.");
        return;
    }

    console.log(`Attempting to remove item row: ${row.id || row}`);

    // Se o item já existe no banco de dados, marcar para destruição
    const idInput = row.querySelector("input[name*='[id]']");
    if (idInput && this.hasItemsContainerTarget) {
        const existingItemId = idInput.value;
        if (existingItemId) {
            // Cria o input hidden _destroy APENAS para itens EXISTENTES (com ID do BD)
            const destroyInput = document.createElement("input");
            destroyInput.type = "hidden";
            // O nome deve corresponder à estrutura para o item com o ID correto
            // Ex: task[task_items_attributes][123][_destroy]
            // Pega o índice do nome do input id (e.g., '123' em '...[123][id]')
            const nameMatch = idInput.name.match(/task\[task_items_attributes\]\[([^\]]+)\]\[id\]/);
            if (nameMatch && nameMatch[1]) {
               const index = nameMatch[1]; // Pode ser numérico (existente) ou 'new_...' (novo mas já no DOM)
               destroyInput.name = `task[task_items_attributes][${index}][_destroy]`;
               destroyInput.value = "1";
               this.formTarget.appendChild(destroyInput); // Adiciona ao formulário, não necessariamente ao itemsContainer
               console.log(`Marked item with index "${index}" (ID: ${existingItemId}) for destruction.`);
            } else {
               console.error("Could not parse index from item ID input name:", idInput.name);
            }
        } else {
            console.warn("Item has an ID input but the value is empty. Assuming unsaved item.");
        }
    } else {
        console.log("Item is new (no ID input) or itemsContainerTarget not found. Will just remove from DOM.");
    }

    // Remover a linha visualmente do DOM
    row.remove();
    console.log("Item row removed from DOM.");
  }


  toggleItemStatus(event) {
    const checkbox = event.currentTarget;
    const row = checkbox.closest(".task-item-row");
    if (!row) {
        console.error("Could not find item row for status toggle.");
        return;
    }

    const textInput = row.querySelector("input[type='text']");
    // Seleciona o input hidden cujo nome termina com '[status]' dentro desta linha
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
       console.log(`Item status toggled to: ${statusInput.value} for item row: ${row.id || row}`);

       // Para atualizar o status de um item individualmente via AJAX/Turbo
       // você precisaria de uma rota específica (como sua action toggle_status no TaskItemsController)
       // e a Task ID e TaskItem ID. Isso seria uma feature separada da submissão do formulário principal.
       // Por enquanto, o status é atualizado no input hidden e será salvo na submissão do form principal.

    } else {
       console.error("Text input or status input not found in item row for toggle status.");
    }
  }


  // Correção para o método submit no task_form_controller.js
  submit(event) {
    // Sempre previne o submit padrão do formulário primeiro
    event.preventDefault();
    console.log("Submit event intercepted by Stimulus controller. Preventing default submit.");

    // Adicionar o item atualmente no campo 'Adicionar item...' se houver conteúdo
    if (this.hasNewItemTarget && this.newItemTarget.value.trim() !== "") {
      this.addNewItem();
      console.log("Added pending new item from input field before submitting.");
    }

    // Perform client-side validation (ex: título obrigatório)
    if (this.hasTitleTarget && !this.titleTarget.value.trim()) {
      console.log("Title is empty. Cannot submit.");
      this.titleTarget.classList.add("border", "border-red-500"); // Adiciona feedback visual
      this.titleTarget.focus();
      return; // Interrompe a função
    } else if (this.hasTitleTarget) {
      this.titleTarget.classList.remove("border", "border-red-500"); // Remove feedback
    }

    // Debugging para verificar os dados do formulário
    const form = this.formTarget;
    const formData = new FormData(form);
    console.log("--- Form Data collected for submission: ---");
    let hasItemAttributes = false;
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
      if (pair[0].startsWith('task[task_items_attributes]')) {
        hasItemAttributes = true;
      }
    }
    
    // Se chegamos aqui, validação passou e itens foram adicionados ao DOM
    if (this.hasFormTarget) {
      console.log("Validation successful. Submitting form normally...");
      // Em vez de usar Turbo.submitForm, vamos submeter o formulário de forma tradicional
      // Isso evita conflitos com o Turbo e garante que o Rails processe corretamente
      form.submit();
    } else {
      console.error("Form target not found. Cannot submit form.");
    }
  }


}