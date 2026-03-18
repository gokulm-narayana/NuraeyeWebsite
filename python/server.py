from flask import Flask, request, jsonify, send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# Serve the parent directory's static files
app = Flask(__name__, static_url_path='', static_folder='../')

# ==============================================================================
# EMAIL CONFIGURATION - ACTION REQUIRED
# ==============================================================================
# To use Gmail, you CANNOT use your regular password. 
# You MUST generate an "App Password":
# 1. Go to your Google Account -> Security.
# 2. Enable 2-Step Verification if it isn't already.
# 3. Search for "App Passwords" in the Security search bar.
# 4. Create an app password for "Mail" / "Mac" (or just custom name "Python Server").
# 5. Paste the 16-character password below.

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "gokulnarayanagen@gmail.com"  
RECEIVER_EMAIL = "gokulnarayanagen@gmail.com"

# REPLACE THIS WITH YOUR 16-CHARACTER GOOGLE APP PASSWORD
APP_PASSWORD = "ygsc hhxy mfue qjen"  
# ==============================================================================

@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    data = request.json
    
    if not data:
        return jsonify({"status": "error", "message": "No data received"}), 400

    # Extract fields
    user_type = data.get('user_type', 'N/A')
    camera_count = data.get('camera_count', 'N/A')
    message = data.get('message', 'N/A')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    email = data.get('email', 'N/A')
    phone = data.get('phone', 'N/A')
    company_name = data.get('company_name', 'N/A')
    business_role = data.get('business_role', 'N/A')
    industry = data.get('industry', 'N/A')
    job_title = data.get('job_title', 'N/A')
    country = data.get('country', 'N/A')
    state = data.get('state', 'N/A')
    city = data.get('city', 'N/A')
    
    # Construct email message
    subject = f"New Contact Request from {first_name} {last_name} ({company_name})"
    
    body = f"""
    New contact form submission from the website:
    
    -- Personal Information --
    Name: {first_name} {last_name}
    Email: {email}
    Phone: {phone}
    
    -- Message Details --
    User Type: {user_type}
    Cameras Needed: {camera_count}
    Message: {message}
    
    -- Company Details --
    Company: {company_name}
    Role: {business_role}
    Industry: {industry}
    Title: {job_title}
    
    -- Location --
    Location: {city}, {state}, {country}
    """
    
    msg = MIMEMultipart()
    msg['From'] = f"Website Contact Form <{SENDER_EMAIL}>"
    msg['To'] = RECEIVER_EMAIL
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # Connect to Gmail SMTP server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Secure the connection
        server.login(SENDER_EMAIL, APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        
        return jsonify({"status": "success", "message": "Email sent successfully!"}), 200
        
    except smtplib.SMTPAuthenticationError:
        error_msg = "Authentication failed. Did you use an App Password?"
        print(f"Error: {error_msg}")
        return jsonify({"status": "error", "message": error_msg}), 401
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"status": "error", "message": "Failed to send email. Check server logs."}), 500

if __name__ == '__main__':
    print("=====================================================")
    print(" Starting NuraEye Local Server on http://localhost:5000 ")
    print("=====================================================")
    app.run(port=5000, debug=True)
