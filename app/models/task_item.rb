class TaskItem < ApplicationRecord
  belongs_to :task

  enum :status, { pending: 0, completed: 1 }

  validates :title, presence: true

  scope :pending, -> { where(status: :pending) }
  scope :completed, -> { where(status: :completed) }

  def toggle_status
    update(status: completed? ? :pending : :completed)
  end

  def user
    task.user
  end
end
