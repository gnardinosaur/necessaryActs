class Api::V1::UsersController < ApplicationController
  def index 
    users = User.all
    render json: users
  end

  def show
    user = User.find(params[:id])
    render json: user
  end

  def create
    user = User.find_or_create_by(name: params[:name])

    render json: UserSerializer.new(user).to_serialized_json
  end
  
  def events
    user = User.find(params[:id])
    events = user.events
    sorted_events = events.sort_by{ |event| event.start_time }
    render json: sorted_events
  end

end
