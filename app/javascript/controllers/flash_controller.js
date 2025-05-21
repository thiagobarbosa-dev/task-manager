import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    dismissAfter: { type: Number, default: 5000 } 
  }
  
  connect() {
    console.log("Flash controller connected")
    if (this.dismissAfterValue > 0) {
      this.dismissTimeout = setTimeout(() => {
        this.dismiss()
      }, this.dismissAfterValue)
    }
  }
  
  disconnect() {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout)
    }
  }
  
  dismiss() {
    this.element.classList.add("opacity-0")
    setTimeout(() => {
      this.element.remove()
    }, 300)
  }
}
