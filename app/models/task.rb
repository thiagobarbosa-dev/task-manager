class Task < ApplicationRecord
  belongs_to :user
  has_many :task_items, dependent: :destroy

  validates :title, presence: true

  accepts_nested_attributes_for :task_items,
                              allow_destroy: true,
                              reject_if: proc { |attributes| attributes["title"].blank? }

  scope :pending, -> { joins(:task_items).where(task_items: { status: :pending }).distinct }
  scope :completed, -> {
    left_joins(:task_items)
      .group(:id)
      .having("COUNT(task_items.id) > 0 AND COUNT(task_items.id) = COUNT(CASE WHEN task_items.status = ? THEN 1 ELSE NULL END)", TaskItem.statuses[:completed])
  }

  def completed?
    task_items.any? && task_items.all?(&:completed?)
  end

  def pending?
    task_items.any? && task_items.any?(&:pending?)
  end

  def progress_percentage
    return 0 if task_items.empty?

    completed_count = task_items.select(&:completed?).count
    (completed_count.to_f / task_items.count * 100).round
  end
end
