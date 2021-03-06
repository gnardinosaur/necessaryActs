class Api::V1::EventsController < ApplicationController
    
    def index
        events = Event.all
        render json: events
    end

    def show 
        event = Event.find(params[:id])
        render json: event
    end
        
    def create
        event = Event.create(title: params[:title], content: params[:content], start_time: params[:start], end_time: params[:end])
        event.users << User.find(params[:user])
        render json: event
    end

    def update
        event = Event.find(params[:id])
        event.update(title: params[:title], content: params[:content], start_time: params[:start], end_time: params[:end])
        render json: event
    end

    def destroy 
        event = Event.find(params[:id])
        event.destroy
        render json: event 
    end

end


