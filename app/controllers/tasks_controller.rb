class TasksController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task, only: [ :show, :edit, :update, :destroy ]

  # GET /tasks
  def index
    @tasks = current_user.tasks.includes(:task_items).order(created_at: :desc)
    @task = current_user.tasks.build
  end

  # GET /tasks/by_category
  def by_category
    @categories = current_user.tasks.pluck(:category).compact.uniq
    @tasks_by_category = {}

    @categories.each do |category|
      @tasks_by_category[category] = current_user.tasks.where(category: category).order(created_at: :desc)
    end

    # Tarefas sem categoria
    @uncategorized_tasks = current_user.tasks.where(category: [ nil, "" ]).order(created_at: :desc)
  end

  # GET /tasks/1
  def show
    @task_items = @task.task_items.order(created_at: :desc)
  end

  # GET /tasks/new
  def new
    @task = current_user.tasks.build
  end

  # GET /tasks/1/edit
  def edit
  end

  # POST /tasks
  def create
    @task = current_user.tasks.build(task_params)

    respond_to do |format|
      if @task.save
        format.html { redirect_to tasks_path, notice: I18n.t("tasks.create.success") }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "#{helpers.dom_id(@task)}_form",
            partial: "form",
            locals: { task: @task }
          )
        }
      end
    end
  end

  # PATCH/PUT /tasks/1
  def update
    respond_to do |format|
      if @task.update(task_params)
        format.html { redirect_to tasks_path, notice: I18n.t("tasks.update.success") }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "#{helpers.dom_id(@task)}_form",
            partial: "form",
            locals: { task: @task }
          )
        }
      end
    end
  end

  # DELETE /tasks/1
  def destroy
    @task.destroy

    respond_to do |format|
      format.html { redirect_to tasks_path, notice: I18n.t("tasks.delete.success") }
      format.turbo_stream
    end
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:id])
  end

  def task_params
    params.require(:task).permit(:title, :category)
  end
end
