class TaskItemsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task
  before_action :set_task_item, only: [ :show, :edit, :update, :destroy, :toggle_status ]

  def index
    @task_items = @task.task_items.order(created_at: :desc)
  end

  def pending
    @task_items = current_user.task_items.pending.order(created_at: :desc)
    render :all_items
  end

  def completed
    @task_items = current_user.task_items.completed.order(created_at: :desc)
    render :all_items
  end

  def show
  end

  def new
    @task_item = @task.task_items.build
  end

  def edit
  end

  def create
    @task_item = @task.task_items.build(task_item_params)

    respond_to do |format|
      if @task_item.save
        format.html { redirect_to task_path(@task), notice: I18n.t("task_items.create.success") }
        format.turbo_stream
      else
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "#{helpers.dom_id(@task_item)}_form",
            partial: "form",
            locals: { task: @task, task_item: @task_item }
          )
        }
      end
    end
  end

  def update
    respond_to do |format|
      if @task_item.update(task_item_params)
        format.html { redirect_to task_path(@task), notice: I18n.t("task_items.update.success") }
        format.turbo_stream
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.turbo_stream {
          render turbo_stream: turbo_stream.replace(
            "#{helpers.dom_id(@task_item)}_form",
            partial: "form",
            locals: { task: @task, task_item: @task_item }
          )
        }
      end
    end
  end

  def destroy
    @task_item.destroy

    respond_to do |format|
      format.html { redirect_to task_path(@task), notice: I18n.t("task_items.delete.success") }
      format.turbo_stream
    end
  end

  def toggle_status
    @task_item.toggle_status!

    respond_to do |format|
      format.html { redirect_to task_path(@task), notice: I18n.t("task_items.update.success") }
      format.turbo_stream
    end
  end

  private

  def set_task
    @task = current_user.tasks.find(params[:task_id])
  end

  def set_task_item
    @task_item = @task.task_items.find(params[:id])
  end

  def task_item_params
    params.require(:task_item).permit(:title, :description, :due_date)
  end
end
