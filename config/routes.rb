Rails.application.routes.draw do
  root to: redirect("/#{I18n.default_locale}")

  scope "(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    authenticated :user do
      root "tasks#index", as: :authenticated_root
    end

    get "/", to: "pages#home", as: :locale_root

    devise_for :users

    resources :tasks, except: [ :show ] do
      collection do
        get :by_category
      end
    end

    resources :task_items, only: [] do
      collection do
        get :pending
        get :completed
      end
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
