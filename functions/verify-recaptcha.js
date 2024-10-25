const axios = require("axios");

const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:5000",
	"http://localhost:8000",
	"http://localhost:8888",
	"http://127.0.0.1:5500",
	"https://subtle-phoenix-a52fad.netlify.app",
	"https://typewriters.io",
];

exports.handler = async (event) => {
	// Handle CORS preflight requests
	if (event.httpMethod === "OPTIONS") {
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
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
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type",
			},
			body: JSON.stringify(verificationResponse.data),
		};
	} catch (error) {
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
			body: JSON.stringify({
				success: false,
				error: error.message,
			}),
		};
	}
};
