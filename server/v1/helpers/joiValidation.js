import Joi from '@hapi/joi';

const schema = {
	signupSchema: Joi.object({
		firstName: Joi.string()
			.min(2)
			.trim()
			.regex(/^\S[A-Za-z]{1,}$/)
			.required(),
		lastName: Joi.string()
			.min(2)
			.trim()
			.regex(/^\S[A-Za-z]{1,}$/)
			.required(),
		email: Joi.string()
			.email()
			.required(),
		password: Joi.string()
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,128}$/)
			.required(),
		gender: Joi.valid('male', 'female', 'Male', 'Female', 'M', 'F').required(),
		jobRole: Joi.string()
			.min(3)
			.required(),
		department: Joi.string()
			.min(3)
			.optional(),
		address: Joi.string()
			.min(3)
			.max(30)
			.optional()
	}),
	loginSchema: Joi.object({
		email: Joi.string()
			.email()
			.trim()
			.required(),
		password: Joi.string().required()
	}),

	articleSchema: Joi.object({
		title: Joi.string()
			.min(5)
			.max(50)
			.trim()
			.required(),
		article: Joi.string()
			.min(20)
			.trim()
			.required()
	}),

	commentSchema: Joi.object({
		comment: Joi.string()
			.replace(/\s+/g, '')
			.trim()
			.required()
	}),

	flagSchema: Joi.object({
		reason: Joi.string()
			.min(5)
			.required()
	})
};

export default schema;
