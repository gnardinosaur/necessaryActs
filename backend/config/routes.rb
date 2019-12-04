Rails.application.routes.draw do

  namespace :api do 
    namespace :v1 do
      resources :events
      resources :users
      get "users/:id/events", to: "users#events"
      resources :user_events
    end
  end
  
end
