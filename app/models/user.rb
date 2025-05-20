class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
        :recoverable, :rememberable, :validatable

  has_many :tasks, dependent: :destroy
  has_many :task_items, through: :tasks

  def pending_tasks
    tasks.pending
  end

  def completed_tasks
    tasks.completed
  end

  def pending_task_items
    tasks.pending.includes(:task_items).flat_map(&:task_items)
  end

  def completed_task_items
    tasks.completed.includes(:task_items).flat_map(&:task_items)
  end
end
