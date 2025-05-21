FactoryBot.define do
  factory :task do
    title { "MyString" }
    category { "MyString" }
    due_date { "2025-05-19 23:21:12" }
    user { nil }
  end
end
