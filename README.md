# AWS Cognito Task App

A secure serverless web application that implements user authentication using Amazon Cognito.

This project demonstrates a complete authentication flow — including user sign-up, email verification, sign-in, and sign-out — using a custom frontend built with HTML, CSS, and JavaScript.


## Live Demo
http://ksmith-cognito-aws-task-app-2026.s3-website-us-east-1.amazonaws.com


## Features

- User sign-up with email and password
- Email-based account confirmation
- User sign-in and sign-out
- Dynamic UI switching between authentication and application views
- Session persistence using localStorage


## Architecture

**Frontend:** HTML, CSS, JavaScript (hosted on Amazon S3)   
**Authentication** Amazon Cognito


## Screenshots

### Login Screen
![Login](screenshots/login.png)

### Confirmation Screen
![Confirmation](screenshots/confirmation.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)


## How It Works

1. User signs up with email and password  
2. Cognito sends a confirmation code via email  
3. User confirms account using the code  
4. User signs in and gains access to the app  
5. Session state is managed on the frontend  


## Technologies Used

- Amazon Cognito
- Amazon S3 (Static Website Hosting)
- HTML
- CSS
- JavaScript


## What I Learned

- Implementing authentication using Amazon Cognito
- Managing authentication flows in a frontend application
- Handling user confirmation and session state
- Debugging AWS and frontend integration issues
- Structuring a serverless application


## Future Improvements

- Connect authentication to backend API (API Gateway + Lambda)
- Store user-specific tasks in DynamoDB
- Secure API Gateway using Cognito authorizers
- Improve UI/UX design
