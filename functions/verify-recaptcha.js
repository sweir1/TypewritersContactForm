const axios = require("axios");

// Allowed origins for CORS
const allowedOrigins = [
	"http://localhost:8888",
	"https://subtle-phoenix-a52fad.netlify.app",
	"https://typewriters.io",
	"https://eduardos-stupendous-site-4488f5.webflow.io",
];

exports.handler = async (event) => {
	// Get and validate origin
	const origin = event.headers.origin || event.headers.Origin;
	if (!allowedOrigins.includes(origin)) {
		return {
			statusCode: 403,
			body: JSON.stringify({
				success: false,
				error: "Origin not allowed",
			}),
		};
	}

	// Common CORS headers
	const corsHeaders = {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Vary": "Origin",
	};

	// Handle CORS preflight requests
	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers: {
				...corsHeaders,
				"Access-Control-Max-Age": "86400",
			},
			body: "",
		};
	}

	try {
		// Validate environment
		if (!process.env.RECAPTCHA_SECRET_KEY) {
			throw new Error("RECAPTCHA_SECRET_KEY is not configured");
		}

		// Parse and validate request
		const { token } = JSON.parse(event.body);
		if (!token) {
			throw new Error("No token provided");
		}

		// Verify token with Google
		const verificationResponse = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
			params: {
				secret: process.env.RECAPTCHA_SECRET_KEY,
				response: token,
			},
		});

		return {
			statusCode: 200,
			headers: corsHeaders,
			body: JSON.stringify(verificationResponse.data),
		};
	} catch (error) {
		console.error("ReCAPTCHA verification error:", error);

		return {
			statusCode: 500,
			headers: corsHeaders,
			body: JSON.stringify({
				success: false,
				error: error.message,
			}),
		};
	}
};
