window.dropdownHandler = {
	initializeCustomDropdowns: function (selectContainers) {
		selectContainers.forEach((container) => {
			const trigger = container.querySelector(".custom-select-trigger");
			const options = container.querySelectorAll(".custom-option");
			const originalSelect = container.parentElement.querySelector("select");

			trigger.addEventListener("click", (e) => {
				e.stopPropagation();
				container.classList.toggle("open");
			});

			options.forEach((option) => {
				option.addEventListener("click", () => {
					const value = option.dataset.value;
					trigger.textContent = option.textContent;
					originalSelect.value = value;

					// Reset validation styling when selection is made
					originalSelect.style.borderColor = "";
					trigger.style.borderColor = "";

					options.forEach((opt) => opt.classList.remove("selected"));
					option.classList.add("selected");
					container.classList.remove("open");
					originalSelect.dispatchEvent(new Event("change"));
				});
			});
		});

		// Close dropdowns when clicking outside
		document.addEventListener("click", () => {
			selectContainers.forEach((container) => container.classList.remove("open"));
		});
	},
};
