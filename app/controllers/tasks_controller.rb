class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [ :show, :edit, :update, :destroy ]

  def index
    @tasks = current_user.tasks.includes(:task_items).order(created_at: :desc)
  end

  def show
  end

  def stimulus_fetch_request?
    request.headers["X-Stimulus-Fetch"] == "true"
  end

  def new
    @task = current_user.tasks.build
    respond_to do |format|
      format.html { render stimulus_fetch_request? ? { partial: "form", locals: { task: @task }, layout: false } : :new }
    end
  end

  def edit
    @task = current_user.tasks.find(params[:id])
    respond_to do |format|
      format.html { render stimulus_fetch_request? ? { partial: "form", locals: { task: @task }, layout: false } : :edit }
    end
  end

  def create
    @task = current_user.tasks.build(task_params)

    respond_to do |format|
      if @task.save
        format.turbo_stream
        format.html { redirect_to tasks_path, notice: t("tasks.created", default: "Tarefa criada com sucesso!") }
      else
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "new_task",
            partial: "tasks/form",
            locals: { task: @task }
          )
        }
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @task.update(task_params)
        format.turbo_stream
        format.html { redirect_to tasks_path, notice: t("tasks.updated", default: "Tarefa atualizada com sucesso!") }
      else
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "new_task",
            partial: "tasks/form",
            locals: { task: @task }
          )
        }
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @task.destroy
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to tasks_path, notice: t("tasks.destroyed", default: "Tarefa excluída com sucesso!") }
    end
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(
      :title,
      :category,
      task_items_attributes: [ :id, :title, :status, :_destroy ]
    )
  end
end
