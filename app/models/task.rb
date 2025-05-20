class Task < ApplicationRecord
  belongs_to :user

  enum status: { pending: 0, in_progress: 1, completed: 2 }
  validates :title, presence: true

  scope :pending, -> { where(status: :pending) }
  scope :completed, -> { where(status: :completed) }

  def completed?
    task_items.any? && task_items.all?(&:completed?)
  end

  def pending?
    task_items.any? && task_items.any?(&:pending?)
  end

  def progress_percentage
    return 0 if task_items.empty?

    (task_items.completed.count.to_f / task_items.count * 100).round
  end
end
