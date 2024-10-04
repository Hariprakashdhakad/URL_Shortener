# URL Shortener API

## Overview
This is a powerful URL shortener API that allows users to shorten URLs, track their usage, and retrieve analytics.

## Features
- **Shorten URLs**: Users can submit original URLs and receive a unique short code.
- **Redirect with Tracking**: Automatically redirect users to the original URL while tracking visits.
- **Analytics**: Retrieve detailed analytics for shortened URLs, including visit counts and device type breakdowns.
- **Custom Short Codes**: Users can specify a custom short code for their shortened URLs.
- **URL Expiration**: Shortened URLs can be set to expire after a specific time frame.
- **Rate Limiting**: Prevent abuse by limiting the number of requests from a single IP address.

## Installation
### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
Navigate to the project directory:
cd url-shortener

Install dependencies:
npm install

Set up environment variables in a .env file. For example:

PORT=5000,
MONGODB_URI=mongodb://localhost:27017/url_shortener

#Run the server:
npm run dev

#API Endpoints
1. Shorten a URL
Endpoint: POST /api/shorten
Request Body:json

{
    "originalUrl": "https://www.example.com",
    "customCode": "example",  // Optional
    "expiresAt": "2024-10-31"  // Optional
}

2. Redirect to Original URL
Endpoint: GET /api/:shortCode

3. Get URL Analytics
Endpoint: GET /api/analytics/:shortCode

Rate Limiting
Requests are limited to 100 per hour per IP address to prevent abuse.

Testing the API
You can use Postman or curl to test the endpoints. Here’s an example of how to shorten a URL:

Set the request method to POST and enter the URL http://localhost:5000/api/shorten.
In the body, provide the original URL in JSON format.

Contributing
Feel free to submit issues and pull requests. Contributions are welcome!
