const axios = require('axios');

const apiBaseUrl = 'http://localhost:3015/api'; 

const users=[
    {
        "email": "admin1@gmail.com",
        "password": "admin123",
        "services": [
            {
                "title": "Luxury Hotel Stay",
                "category": "hotels",
                "pricePerDay": 250,
                "description": "A five-star hotel offering luxurious rooms and amenities.",
                "availableDates": ["2024-10-05", "2024-10-06", "2024-10-07"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678911",
                    "email": "stay@luxuryhotel.com"
                }
            },
            {
                "title": "DJ for Events",
                "category": "dJs",
                "pricePerDay": 500,
                "description": "Experienced DJ to keep the party alive.",
                "availableDates": ["2024-10-20", "2024-10-21"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678944",
                    "email": "dj@party.com"
                }
            },
            {
                "title": "Creative Event Planner",
                "category": "eventPlanners",
                "pricePerDay": 1000,
                "description": "Let us plan your perfect event.",
                "availableDates": ["2024-10-22", "2024-10-23"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678955",
                    "email": "planner@events.com"
                }
            }
        ]
    },
    {
        "email": "admin2@gmail.com",
        "password": "admin123",
        "services": [
            {
                "title": "Experienced Photographer",
                "category": "photographers",
                "pricePerDay": 700,
                "description": "Capture your moments with our skilled photographer.",
                "availableDates": ["2024-10-25", "2024-10-26"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678966",
                    "email": "photo@capture.com"
                }
            },
            {
                "title": "Luxury Transportation Services",
                "category": "transportationServices",
                "pricePerDay": 400,
                "description": "Luxury car rentals and shuttle services.",
                "availableDates": ["2024-10-07", "2024-10-08"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678902",
                    "email": "transport@luxury.com"
                }
            },
            {
                "title": "Custom Cake Baker",
                "category": "bakers",
                "pricePerDay": 250,
                "description": "Delicious custom cakes for weddings and events.",
                "availableDates": ["2024-10-13", "2024-10-14"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678905",
                    "email": "bake@cakes.com"
                }
            }
        ]
    },
    {
        "email": "admin3@gmail.com",
        "password": "admin123",
        "services": [
            {
                "title": "Live Entertainment",
                "category": "entertainment",
                "pricePerDay": 1500,
                "description": "Professional entertainers for your event.",
                "availableDates": ["2024-10-05", "2024-10-06"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678901",
                    "email": "entertain@live.com"
                }
            },
            {
                "title": "Professional Sound and Lighting",
                "category": "soundAndLighting",
                "pricePerDay": 700,
                "description": "Setup and management of sound and lighting for events.",
                "availableDates": ["2024-10-09", "2024-10-10"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678903",
                    "email": "sound@lighting.com"
                }
            },
            {
                "title": "Event Security Services",
                "category": "securityServices",
                "pricePerDay": 500,
                "description": "Professional security services for events.",
                "availableDates": ["2024-10-15", "2024-10-16"],
                "location": "Springfield",
                "contactDetails": {
                    "phone": "2345678906",
                    "email": "security@events.com"
                }
            }
        ]
    }
]

const createServices = async (token, user) => {
    for (const service of user.services) {
        try {
            console.log(`${apiBaseUrl}/admin/service`);
            
            const response = await axios.post(`${apiBaseUrl}/admin/service`, service, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(`Service created by ${user.email}: ${response.data.title}`);
        } catch (error) {
            console.error('Error creating service:', error.response ? error.response.data : error.message);
        }
    }
};

const loginAndCreateServices = async (user) => {
    try {
        // Login to get the token
        const loginResponse = await axios.post(`${apiBaseUrl}/auth/signin`, {
            email: user.email,
            password: user.password,
        });
        const token = loginResponse.data.token; // Adjust based on your API response structure
        console.log(`Login successful for ${user.email}, token received:`, token);

        // Create services using the received token
        await createServices(token, user);
    } catch (error) {
        console.error(`Login failed for ${user.email}:`, error.response ? error.response.data : error.message);
    }
};

const main = async () => {
    for (const user of users) {
        await loginAndCreateServices(user);
    }
};

// Execute the main function
main();
