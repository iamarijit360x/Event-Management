const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const bookingConfirmationEmail = (bookingData) => {
    console.log(bookingData);
    
    const { serviceId, bookingDates, totalPrice, userId,location } = bookingData;
    const formattedDates = bookingDates.map((date) => formatDate(date)).join(' - ');

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 660px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .header img {
                max-width: 100px;
            }
            .header h1 {
                font-size: 24px;
                margin: 20px 0;
                color: #333;
            }
            .content {
                text-align: center;
                color: #333;
            }
            .content h2 {
                font-size: 22px;
                color: #555;
            }
            .content p {
                font-size: 16px;
                color: #777;
            }
            .countdown {
                font-size: 20px;
                color: #ff6f61;
                margin: 20px 0;
            }
            .booking-info {
                background-color: #f9f9f9;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
            }
            .booking-info h3 {
                margin: 10px 0;
                color: #444;
            }
            .booking-info p {
                font-size: 16px;
                color: #666;
            }
            .cta {
                display: inline-block;
                margin: 20px 10px;
                padding: 15px 30px;
                background-color: #ff6f61;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="logo" alt="Company Logo" />
                <h1>Thanks ${userId?.name} for Booking!</h1>
            </div>
            <div class="content">
                <h2>Your Booking is Confirmed</h2>
                <p>Your booking for <strong>${serviceId.title}</strong> has been successfully confirmed.</p>
                <div class="countdown">Your experience starts on: <br> ${formatDate(bookingDates[0])}</div>
            </div>
            <div class="booking-info">
                <h3>Booking Details</h3>
                <p><strong>Service:</strong> ${serviceId.title}</p>
                <p><strong>Date:</strong> ${formattedDates}</p>
                <p><strong>Total Price:</strong> $${totalPrice}</p>
                <p><strong>Location:</strong> ${serviceId.location}</p>
                <p><strong>Contact:</strong> ${serviceId?.contactDetails?.email} | ${serviceId.contactDetails?.phone}</p>
            </div>
            <div class="content">
                <a 
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${bookingData?.title}&dates=START_DATE/END_DATE&details=${bookingData?.details}&location=${bookingData?.location}" class="cta">Add to Google Calendar</a>
            </div>
            <div class="footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
                <p><a href="#">Contact Us</a> | <a href="#">Terms & Privacy</a></p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = bookingConfirmationEmail;
