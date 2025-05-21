# app/controllers/tasks_controller.rb
class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [ :show, :edit, :update, :destroy ]

  def index
    @tasks = current_user.tasks.includes(:task_items).order(created_at: :desc)
  end

  def show
  end

  def new
    @task = current_user.tasks.build
  end

  def edit
  end

  def create
    # Converter os parâmetros de task_items_attributes de hash para array
    if params[:task] && params[:task][:task_items_attributes].is_a?(Hash)
      # Transformar o hash em um array de atributos
      items_array = []
      params[:task][:task_items_attributes].each do |_key, item_attributes|
        items_array << item_attributes
      end
      # Substituir o hash original pelo array
      params[:task][:task_items_attributes] = items_array
    end

    @task = current_user.tasks.build(task_params)

    respond_to do |format|
      if @task.save
        format.html { redirect_to tasks_path, notice: t("tasks.created", default: "Tarefa criada com sucesso!") }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def update
    # Converter os parâmetros de task_items_attributes de hash para array
    if params[:task] && params[:task][:task_items_attributes].is_a?(Hash)
      # Transformar o hash em um array de atributos
      items_array = []
      params[:task][:task_items_attributes].each do |_key, item_attributes|
        items_array << item_attributes
      end
      # Substituir o hash original pelo array
      params[:task][:task_items_attributes] = items_array
    end

    respond_to do |format|
      if @task.update(task_params)
        format.html { redirect_to tasks_path, notice: t("tasks.updated", default: "Tarefa atualizada com sucesso!") }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream
      end
    end
  end

  def destroy
    @task.destroy

    respond_to do |format|
      format.html { redirect_to tasks_path, notice: t("tasks.destroyed", default: "Tarefa excluída com sucesso!") }
      format.turbo_stream { render turbo_stream: turbo_stream.remove("task_#{params[:id]}") }
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
