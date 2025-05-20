// app/javascript/controllers/flash_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    dismissAfter: { type: Number, default: 5000 } 
  }
  
  connect() {
    // Auto-dismiss flash messages after the specified time
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
    this.element.style.opacity = 0
    setTimeout(() => {
      this.element.remove()
    }, 300) // Match the transition duration in CSS
  }
}
