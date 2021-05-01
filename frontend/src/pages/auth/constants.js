export const registerInputs = () => ([
		{
				name: "username",
				value: "",
				type: "text",
				placeholder: "Username",
				valid: { regex: /^[0-9a-zA-Z]{3,16}$/ },
				errorMsg: "3 to 16 alphanumeric characters",
				properties: { maxLength: 16 },
		},
		{
				name: "password",
				value: "",
				type: "password",
				placeholder: "Password",
				valid: { regex: /^\S{6,30}$/ },
				errorMsg: "6 to 30 non whitespace characters",
				properties: { maxLength: 30 },
		},
		{
				name: "repeatPassword",
				value: "",
				type: "password",
				placeholder: "Repeat password",
				valid: { field: "password" },
				errorMsg: "Passwords don't match",
		},
]);