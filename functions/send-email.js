const nodemailer = require("nodemailer");

// Allowed origins for CORS
const allowedOrigins = [
	"http://localhost:8888",
	"https://subtle-phoenix-a52fad.netlify.app",
	"https://typewriters.io",
	"https://eduardos-stupendous-site-4488f5.webflow.io",
];

exports.handler = async (event, context) => {
	// Handle CORS preflight requests
	if (event.httpMethod === "OPTIONS") {
		const origin = event.headers.origin || event.headers.Origin;
		if (allowedOrigins.includes(origin)) {
			return {
				statusCode: 204,
				headers: {
					"Access-Control-Allow-Origin": origin,
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Allow-Methods": "POST, OPTIONS",
					"Access-Control-Max-Age": "86400",
					"Vary": "Origin",
				},
			};
		}
		return { statusCode: 403, body: "Forbidden" };
	}

	// Only allow POST
	if (event.httpMethod !== "POST") {
		return { statusCode: 405, body: "Method Not Allowed" };
	}

	// Verify origin for actual requests
	const origin = event.headers.origin || event.headers.Origin;
	if (!allowedOrigins.includes(origin)) {
		return { statusCode: 403, body: "Forbidden" };
	}

	try {
		const data = JSON.parse(event.body);
		const {
			firstname,
			jobtitle,
			email,
			phone,
			website,
			company_size,
			budget,
			interested_in,
			industry,
			usermessage,
		} = data;

		// Create transporter
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS, // Use Gmail App Password
			},
		});

		const htmlContent = `
    <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
                h2 { color: #2980b9; }
                .contact-details { background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .contact-details p { margin: 5px 0; }
                .highlight { font-weight: bold; color: #2c3e50; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Contact Form Submission - Typewriters.io</h1>
                <div class="contact-details">
                    <h2>Contact Information</h2>
                    <p><span class="highlight">Name:</span> ${firstname}</p>
                    <p><span class="highlight">Job Title:</span> ${jobtitle}</p>
                    <p><span class="highlight">Email:</span> ${email}</p>
                    <p><span class="highlight">Phone:</span> ${phone}</p>
                    <p><span class="highlight">Website:</span> ${website}</p>
                </div>
                <div class="contact-details">
                    <h2>Company Information</h2>
                    <p><span class="highlight">Company Size:</span> ${company_size}</p>
                    <p><span class="highlight">Monthly Budget:</span> ${budget}</p>
                    <p><span class="highlight">Industry:</span> ${industry}</p>
                    <p><span class="highlight">Interested In:</span> ${interested_in}</p>
                    <p><span class="highlight">Message:</span> ${usermessage}</p>
                </div>
                <p>Please follow up with this contact as soon as possible.</p>
            </div>
        </body>
    </html>
    `;

		// Send email
		let info = await transporter.sendMail({
			from: '"Typewriters.io" <' + process.env.EMAIL_USER + ">",
			to: process.env.NOTIFICATION_EMAIL,
			subject: "New Contact Form Submission - Typewriters.io",
			text: `New contact form submission received from ${firstname}. Company Size: ${company_size}, Budget: ${budget}, Industry: ${industry}. Please check the HTML version for full details.`,
			html: htmlContent,
		});

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Vary": "Origin",
			},
			body: JSON.stringify({ message: "Email sent successfully" }),
		};
	} catch (error) {
		console.error("Error sending email:", error);
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": origin,
				"Access-Control-Allow-Headers": "Content-Type",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Vary": "Origin",
			},
			body: JSON.stringify({ error: "Failed to send email" }),
		};
	}
};
