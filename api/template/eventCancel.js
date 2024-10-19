const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

const eventCancellationEmail = (cancellationData) => {
    const { eventId, refundAmount, userId, cancellationDate } = cancellationData;

    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Cancellation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 6px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .header {
                border-bottom: 2px solid #f1c40f;
                padding-bottom: 20px;
                text-align: center;
            }
            .header img {
                max-width: 120px;
            }
            .header h1 {
                font-size: 24px;
                color: #333;
                margin: 0;
                padding-top: 20px;
            }
            .content {
                padding: 20px 0;
                color: #333;
                text-align: center;
            }
            .content h2 {
                font-size: 20px;
                color: #e74c3c;
                margin-bottom: 10px;
            }
            .content p {
                font-size: 16px;
                color: #555;
            }
            .content ul {
                list-style-type: none;
                padding-left: 0;
            }
            .content ul li {
                font-size: 16px;
                color: #777;
                margin: 10px 0;
            }
            .footer {
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                font-size: 12px;
                color: #999;
            }
            .footer a {
                color: #3498db;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="logo" alt="Company Logo" />
                <h1>Event Cancellation Notice</h1>
            </div>
            <div class="content">
                <h2>Your Event Has Been Canceled</h2>
                <p>Hello ${userId?.name},</p>
                <p>We regret to inform you that your booking for <strong>${eventId.title}</strong> scheduled for <strong>${formatDate(cancellationDate)}</strong> has been canceled.</p>
                <ul>
                    <li>Refund amount: <strong>$${refundAmount}</strong></li>
                    <li>Location: <strong>${eventId.location}</strong></li>
                    <li>Contact: <strong>${eventId.contactDetails?.email} | ${eventId.contactDetails?.phone}</strong></li>
                </ul>
            </div>
            <div class="content">
                <p>If you have any questions, feel free to <a href="contact-support-link">contact our support team</a>.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
                <p><a href="#">Contact Us</a> | <a href="#">Terms & Privacy</a></p>
            </div>
        </div>
    </body>
    </html>`;
};

module.exports = eventCancellationEmail;
