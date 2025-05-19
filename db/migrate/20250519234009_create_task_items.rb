class CreateTaskItems < ActiveRecord::Migration[8.0]
  def change
    create_table :task_items do |t|
      t.string :title
      t.integer :status, default: 0
      t.datetime :due_date
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
  end
end
