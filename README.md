# Note Taker - Supabase Powered Web Application

A beautiful, modern note-taking web application built with vanilla HTML, CSS, and JavaScript, powered by Supabase for authentication and data storage.

## Features

- 🔐 **User Authentication** - Sign up, sign in, email confirmation, and password reset
- 📝 **Note Management** - Create, read, update, and delete notes
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 🔒 **Secure** - User-specific notes with Supabase Row Level Security
- ⚡ **Real-time** - Instant updates with Supabase
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices

## Project Structure

```
notetaker/
├── index.html              # Homepage
├── signup.html             # Sign up page
├── signin.html             # Sign in page
├── reset-password.html     # Password reset page
├── email-confirmation.html # Email confirmation page
├── dashboard.html          # Dashboard with notes CRUD
├── styles.css              # Global styles
├── auth.js                 # Authentication handler
├── dashboard.js            # Notes CRUD operations
├── config.js               # Supabase configuration
├── .env                    # Environment variables
└── README.md               # This file
```

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be fully set up

### 2. Create the Notes Table

In your Supabase project, go to the SQL Editor and run this SQL command:

```sql
-- Create notes table
CREATE TABLE notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own notes
CREATE POLICY "Users can view their own notes"
    ON notes FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own notes
CREATE POLICY "Users can insert their own notes"
    ON notes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own notes
CREATE POLICY "Users can update their own notes"
    ON notes FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own notes
CREATE POLICY "Users can delete their own notes"
    ON notes FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);
```

### 3. Configure Email Settings (Optional but Recommended)

For production use, configure email settings in Supabase:

1. Go to **Authentication > Email Templates** in your Supabase dashboard
2. Customize the email templates for:
   - Confirmation email
   - Password reset email
3. Go to **Authentication > Settings** to configure:
   - SMTP settings (for custom email provider)
   - Redirect URLs
   - Site URL

### 4. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings > API**
2. Copy your **Project URL** (looks like: `https://xxxxx.supabase.co`)
3. Copy your **anon/public** key (the public API key)

### 5. Configure the Application

1. Open the `.env` file and replace the placeholder values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

2. Open the `config.js` file and update the credentials:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 6. Run the Application

Since this is a static web application, you can run it using any local web server:

#### Option 1: Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser to `http://localhost:8000`

#### Option 2: Using Node.js (with http-server)

```bash
# Install http-server globally
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open your browser to `http://localhost:8000`

#### Option 3: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 4: Using PHP

```bash
php -S localhost:8000
```

Then open your browser to `http://localhost:8000`

## Usage Guide

### Creating an Account

1. Click **"Get Started"** or **"Sign Up"** on the homepage
2. Enter your email and password (minimum 6 characters)
3. Confirm your password
4. Click **"Create Account"**
5. Check your email for the confirmation link
6. Click the confirmation link to verify your account

### Signing In

1. Go to the **Sign In** page
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to the dashboard

### Managing Notes

#### Creating a Note

1. In the dashboard, click **"New Note"**
2. Enter a title and content
3. Click **"Save Note"**

#### Editing a Note

1. Click the **edit icon** (pencil) on any note card
2. Modify the title or content
3. Click **"Update Note"**

#### Deleting a Note

1. Click the **delete icon** (trash) on any note card
2. Confirm the deletion in the modal
3. Click **"Delete"**

#### Viewing a Note

1. Click anywhere on a note card to view it in a modal

### Resetting Password

1. Click **"Forgot password?"** on the sign-in page
2. Enter your email address
3. Check your email for the reset link
4. Click the link and follow the instructions

## Security Features

- **Row Level Security (RLS)** - Users can only access their own notes
- **Email Verification** - Required for account activation
- **Secure Authentication** - Powered by Supabase Auth
- **Password Requirements** - Minimum 6 characters
- **Session Management** - Automatic token refresh

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **CDN**: Supabase JS Client Library

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Email Confirmation Not Working

- Check your spam/junk folder
- Verify email settings in Supabase dashboard
- Make sure the redirect URL is correctly configured
- Try the "Resend Confirmation Email" button

### Notes Not Loading

- Check browser console for errors
- Verify Supabase credentials in `config.js`
- Ensure the notes table was created correctly
- Check that Row Level Security policies are set up

### Authentication Issues

- Clear browser cache and cookies
- Check that Supabase project is active
- Verify API keys are correct
- Ensure email confirmation is enabled in Supabase settings

### CORS Errors

- Make sure you're running the app through a local server (not file://)
- Check Supabase URL in config.js
- Verify your domain is allowed in Supabase settings

## Production Deployment

### Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: (none needed)
4. Set publish directory: `/`
5. Deploy!

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy!

### GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select main branch
4. Save and deploy

**Important**: Remember to update the redirect URLs in Supabase Authentication settings to match your production domain!

## Environment Variables for Production

For production deployments, use environment variables or build-time configuration:

- Never commit real credentials to version control
- Use `.env` files (excluded from git via `.gitignore`)
- Set environment variables in your hosting platform
- Use build scripts to inject credentials at deployment time

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation: https://supabase.com/docs
- Open an issue on GitHub

## Credits

Built with ❤️ using:
- [Supabase](https://supabase.com) - Backend and Authentication
- Modern CSS and JavaScript
- SVG icons for beautiful UI

---

**Happy Note Taking! 📝**
