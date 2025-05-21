import { Controller } from "@hotwired/stimulus";
import debounce from "debounce";

export default class extends Controller {
  static targets = ["input", "statusFilter"]

  connect() {
    console.log("Search tasks controller connected");
    this._submitForm = debounce(this._submitForm.bind(this), 300);
  }

  performSearch() {
    this._submitForm();
  }

  applyStatusFilter(event) {
    event.preventDefault();
    //  console.log("Applying status filter:", event.currentTarget.dataset.value);
    this.statusFilterTarget.value = event.currentTarget.dataset.value;

    this.element.requestSubmit();
  }

  _submitForm() {
    console.log("Submitting search form...");
    this.element.requestSubmit();
  }

  disconnect() {
     // this._submitForm.cancel(); // Remova se removeu em applyStatusFilter
  }
}