FactoryBot.define do
  factory :task do
    title { "MyString" }
    description { "MyText" }
    status { 1 }
    user { nil }
    due_date { "2025-05-19 23:21:12" }
  end
end
