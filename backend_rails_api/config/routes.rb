Rails.application.routes.draw do

  namespace :api do 
    namespace :v1 do
      resources :user_events 
      resources :events
      resources :users, only: [:index]
    end
  end
  
end
