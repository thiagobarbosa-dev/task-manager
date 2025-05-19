FactoryBot.define do
  factory :task_item do
    title { "MyString" }
    status { 1 }
    due_date { "2025-05-19 23:40:09" }
    task { nil }
  end
end
