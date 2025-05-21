import { application } from "controllers/application"

// console.log("Stimulus controllers are being imported.");

import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"

// console.log("Stimulus controllers imported. Registering...");

eagerLoadControllersFrom("controllers", application)

// console.log("Stimulus controllers registered.");
