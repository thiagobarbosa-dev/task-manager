import { Application } from "@hotwired/stimulus"

const application = Application.start()

console.log("Stimulus Application started."); // Adicione este log

application.debug = false
window.Stimulus   = application

export { application }
