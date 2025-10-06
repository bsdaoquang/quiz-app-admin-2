/**
 * {
 * 		title: { type: String, required: true },
 * 		description: { type: String },
 * 		questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
 * 		createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 * 	},
 *
 * @format
 */

export interface TestModel {
	_id: string;
	title: string;
	description?: string;
	questions: string[];
	categoryId: string;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}
