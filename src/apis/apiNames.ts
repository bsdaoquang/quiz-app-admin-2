/** @format */

export const API_NAMES = {
	users: {
		login: '/users/login',
		register: '/users/register',
		profile: '/users/profile',
		me: '/users/me',
		update: '/users', // PUT /users/:id
		verifyCode: '/users/verify-code', // POST /users/verify-code
	},
	admin: {
		createPermission: '/users/admin/create-permission',
	},
	questions: {
		get: '/questions',
		handleQuestions: '/questions',
		manyQuestions: '/questions/many',
		deleteMany: '/questions',
		getCategories: '/questions/categories',
		category: '/questions/category',
	},
	professors: {
		index: '/professors',
		create: '/professors',
	},
};
