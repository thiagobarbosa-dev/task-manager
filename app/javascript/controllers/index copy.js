// app/javascript/controllers/index.js
import { application } from "controllers/application"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"

// Importar controllers
import TaskFormController from "./task_form_controller"
import FlashController from "./flash_controller"

// Registrar controllers
application.register("task-form", TaskFormController)
application.register("flash", FlashController)

eagerLoadControllersFrom("controllers", application)
