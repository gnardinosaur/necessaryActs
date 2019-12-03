# Users
5.times do
    User.create(name: Faker::Name.first_name, phone_number: Faker::PhoneNumber.phone_number)
end
# Events
5.times do 
    Event.create(title: Faker::Hipster.word, content: Faker::Hipster.sentence, start_time: Faker::Time.backward(days: 7), end_time: Faker::Time.forward(days: 7))
end

# User Events
5.times do
    UserEvent.create(user_id: rand(1..5), event_id: rand(1..5))
end
