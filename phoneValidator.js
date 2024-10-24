// Phone validator module
window.phoneValidator = {
	// Format the phone number as the user types
	formatPhoneNumber: function (inputElement) {
		// Set initial value with + if empty
		if (!inputElement.value) {
			inputElement.value = "+";
		}

		inputElement.addEventListener("focus", function (e) {
			// If empty when focused, add +
			if (!e.target.value) {
				e.target.value = "+";
			}
		});

		inputElement.addEventListener("input", function (e) {
			// Get cursor position before formatting
			const cursorPosition = e.target.selectionStart;

			// Remove all non-numeric characters except +
			let value = e.target.value.replace(/[^\d+]/g, "");

			// Ensure + is always at the start
			if (!value.startsWith("+")) {
				value = "+" + value;
			}

			// Remove any additional + symbols that might appear later in the string
			value = "+" + value.substring(1).replace(/\+/g, "");

			e.target.value = value;

			// Adjust cursor position after formatting
			const newCursorPosition = Math.min(cursorPosition, value.length);
			e.target.setSelectionRange(newCursorPosition, newCursorPosition);
		});
	},

	// Validate the phone number
	validatePhoneNumber: function (phone) {
		// Remove all formatting characters to check the actual digits
		const cleanPhone = phone.replace(/[^\d+]/g, "");
		// Must start with + and have at least 7 digits (minimum length for most international numbers)
		return cleanPhone.startsWith("+") && cleanPhone.length >= 8;
	},
};
