// Phone validator module
window.phoneValidator = {
	// Format the phone number as the user types
	formatPhoneNumber: function (inputElement) {
		inputElement.addEventListener("input", function (e) {
			// Remove all non-numeric characters except +
			let value = e.target.value.replace(/[^\d+]/g, "");

			// Ensure only one + at the beginning
			if (value.includes("+")) {
				value = "+" + value.replace(/\+/g, "");
			}

			// Format US numbers if they start with +1 or just numbers
			if (value.startsWith("+1")) {
				if (value.length > 2) {
					value = `${value.slice(0, 2)} (${value.slice(2, 5) || ""}${value.length > 5 ? ") " : ""}${value.slice(5, 8) || ""}${value.length > 8 ? "-" : ""}${value.slice(8, 12) || ""}`;
				}
			} else if (!value.startsWith("+")) {
				if (value.length > 0) {
					value = `+1 (${value.slice(0, 3) || ""}${value.length > 3 ? ") " : ""}${value.slice(3, 6) || ""}${value.length > 6 ? "-" : ""}${value.slice(6, 10) || ""}`;
				}
			}

			e.target.value = value;
		});
	},

	// Validate the phone number
	validatePhoneNumber: function (phone) {
		// Remove all formatting characters to check the actual digits
		const cleanPhone = phone.replace(/[^\d+]/g, "");

		// Check for international format starting with +
		if (cleanPhone.startsWith("+")) {
			// Must have at least 10 digits after the + symbol
			return cleanPhone.length >= 11;
		}

		// For non-international format, must have exactly 10 digits
		return cleanPhone.length === 10;
	},
};
