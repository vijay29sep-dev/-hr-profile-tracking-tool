# HR Profile Tracker

A comprehensive web application for HR teams to track candidate profiles through the entire evaluation process, from initial application to final hiring decision.

## Features

### Profile Management
- ✅ Create and manage candidate profiles
- ✅ Track personal information, experience, and technology stack
- ✅ Store resume links and contact details
- ✅ Search and filter profiles by various criteria

### Evaluation Tracking
- ✅ Schedule and manage multiple evaluation rounds
- ✅ Support for different evaluation types (HR Screening, Technical, Final, Customer)
- ✅ Record interview dates, panel members, and evaluator details
- ✅ Score tracking (Technical, Communication, Overall scores)
- ✅ Detailed feedback and recommendations
- ✅ Schedule follow-up rounds

### Status Management
- ✅ Track profile status (New, In Progress, Shortlisted, Rejected, Hired)
- ✅ Manage evaluation stages (Initial, HR Screening, Technical, Final, Customer)
- ✅ Complete status history with timestamps and reasons
- ✅ User attribution for all changes

### Dashboard & Analytics
- ✅ Overview dashboard with key metrics
- ✅ Recent profiles and upcoming interviews
- ✅ Status distribution statistics
- ✅ Quick access to important information

### User Management
- ✅ Secure authentication system
- ✅ JWT-based session management
- ✅ User roles and permissions
- ✅ Activity tracking

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite** database for data storage
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **React Hook Form** for form management
- **Axios** for API communication
- **React Hot Toast** for notifications
- **date-fns** for date formatting

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-profile-tracker
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your preferred settings
   ```

4. **Start the application**
   ```bash
   cd ..
   npm start
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

5. **Access the application**
   - Open http://localhost:3000 in your browser
   - Use the default credentials:
     - Username: `admin`
     - Password: `admin123`

### Development Mode

For development with hot reloading:

```bash
npm run dev
```

## Project Structure

```
hr-profile-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── utils/          # Utility functions and API
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── database.js         # Database setup and schema
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Profiles
- `GET /api/profiles` - Get all profiles (with filtering)
- `GET /api/profiles/:id` - Get profile details
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id/status` - Update profile status

### Evaluations
- `POST /api/profiles/:id/evaluations` - Add evaluation
- `PUT /api/evaluations/:id` - Update evaluation

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

The application uses SQLite with the following main tables:

- **users** - HR team members and authentication
- **profiles** - Candidate profile information
- **evaluations** - Interview and evaluation records
- **status_history** - Complete audit trail of status changes

## Usage Guide

### Adding a New Profile

1. Click "Add Profile" from the dashboard or profiles page
2. Fill in the candidate information:
   - Name (required)
   - Contact details (email, phone)
   - Experience and current company
   - Position applied for (required)
   - Technology stack (required)
   - Resume path/URL

### Managing Evaluations

1. Go to a profile detail page
2. Click "Add Evaluation" to schedule a new interview
3. Fill in evaluation details:
   - Type (HR Screening, Technical, Final, Customer)
   - Evaluator and panel member names
   - Scheduled and actual interview dates
   - Scores and feedback
   - Recommendations and next steps

### Updating Status

1. From the profile detail page, click "Update Status"
2. Select the new status and stage
3. Optionally add a reason for the change
4. All changes are tracked in the status history

### Filtering and Search

1. Use the search bar to find profiles by name, email, or position
2. Apply filters by status and stage
3. Clear filters to see all profiles

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Future Enhancements

Potential improvements for future versions:
- File upload for resumes
- Email notifications for interview scheduling
- Advanced reporting and analytics
- Integration with calendar systems
- Mobile responsive design improvements
- Bulk operations for profiles
- Export functionality (PDF, Excel)
- Advanced user roles and permissions