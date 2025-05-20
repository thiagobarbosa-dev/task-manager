# app/helpers/tasks_helper.rb
module TasksHelper
  def task_color_class(task)
    return "border-gray-300" if task.task_items.empty?

    if task.completed?
      "border-green-500"
    else
      case task.progress
      when 0..25
        "border-red-400"
      when 26..50
        "border-yellow-400"
      when 51..75
        "border-blue-400"
      else
        "border-indigo-400"
      end
    end
  end

  def task_status_text(task)
    if task.task_items.empty?
      t("tasks.status.empty", default: "Vazia")
    elsif task.completed?
      t("tasks.status.completed", default: "Concluída")
    else
      t("tasks.status.in_progress", progress: task.progress, default: "%{progress}% concluída")
    end
  end
end
