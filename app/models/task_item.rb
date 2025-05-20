class TaskItem < ApplicationRecord
  belongs_to :task

  enum status: { pending: 0, completed: 1 }

  validates :title, presence: true

  scope :pending, -> { where(status: :pending) }
  scope :completed, -> { where(status: :completed) }

  def completed?
    status == "completed"
  end

  def pending?
    status == "pending"
  end

  def toggle_status
    self.status = completed? ? :pending : :completed
    save
  end

  def user
    task.user
  end
end
