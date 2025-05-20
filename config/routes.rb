# config/routes.rb
Rails.application.routes.draw do
  # Redirecionar raiz para o locale padrão
  root to: redirect("/#{I18n.default_locale}")

  scope "(:locale)", locale: /#{I18n.available_locales.join("|")}/ do
    # Definir raiz para usuários autenticados
    authenticated :user do
      root "tasks#index", as: :authenticated_root
    end

    # Definir raiz para visitantes
    get "/", to: "pages#home", as: :locale_root

    # Devise sem callbacks OmniAuth
    devise_for :users

    # Resto das suas rotas...
    resources :tasks do
      resources :task_items do
        member do
          patch :toggle_status
        end
      end

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
