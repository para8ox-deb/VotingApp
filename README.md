# Voting Application

This is a backend application designed for a voting system, where authenticated users can cast their vote for candidates. It features user sign-up, login, candidate management, and voting functionalities. The application ensures secure user authentication using Aadhar Card numbers and JSON Web Tokens (JWT). Admin users have privileges to manage candidates but are restricted from voting.

## Features

- **User Sign Up & Login**:
  - Users can sign up and log in using their Aadhar Card Number and a password.
  
- **View Candidates**:
  - Authenticated users can view a list of all registered candidates.
  
- **Vote for a Candidate**:
  - Users can vote for a candidate, but each user is limited to one vote per election cycle.
  
- **Admin Panel**:
  - Admins can manage the candidate list by adding, updating, or deleting candidates.
  - Admins cannot cast votes.

## Technologies Used

- **Backend Framework**: Node.js with Express.js for building the API.
- **Database**: MongoDB for storing user, candidate, and voting data.
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication.
- **Authorization**: Role-based access control for Admin and User roles.

## API Endpoints

### Authentication

- **Sign Up a User**  
  `POST /signup`  
  Request body: `{ aadharNumber, password }`

- **Login a User**  
  `POST /login`  
  Request body: `{ aadharNumber, password }`

### Candidates

- **Get All Candidates**  
  `GET /candidates`  
  Description: Fetch the list of all registered candidates.

- **Add a Candidate (Admin Only)**  
  `POST /candidates`  
  Request body: `{ name, party, description }`  
  Description: Allows an admin to add a new candidate.

- **Update Candidate (Admin Only)**  
  `PUT /candidates/:id`  
  Request body: `{ name, party, description }`  
  Description: Allows an admin to update the details of a specific candidate using the candidate’s ID.

- **Delete Candidate (Admin Only)**  
  `DELETE /candidates/:id`  
  Description: Allows an admin to delete a candidate from the system using the candidate’s ID.

### Voting

- **Get Vote Count**  
  `GET /candidates/vote/count`  
  Description: Retrieve the total number of votes for each candidate.

- **Vote for a Candidate (User Only)**  
  `POST /candidates/vote/:id`  
  Description: Allows an authenticated user to cast their vote for a specific candidate (only one vote allowed per user).

### User Profile

- **Get Profile Information**  
  `GET /users/profile`  
  Description: Fetches the logged-in user’s profile information.

- **Change Password**  
  `PUT /users/profile/password`  
  Request body: `{ oldPassword, newPassword }`  
  Description: Allows users to change their password.

## Future Improvements

- **Email Notifications**: Implement email notifications to confirm successful registration and voting.
- **Audit Logs**: Add audit logs to track all admin actions for transparency.
- **Real-Time Voting Updates**: Use WebSockets to provide real-time updates for vote counts.
- **Voting Deadline**: Add an option for setting voting deadlines or election periods.
- **Admin Dashboard**: Build a frontend admin dashboard for better candidate management and visual analytics of voting data.

## Contribution

Contributions are welcome! Please fork the repository and submit a pull request for any features or improvements you'd like to add.

## License

This project is licensed under the MIT License.
