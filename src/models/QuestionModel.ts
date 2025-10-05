/** @format */
/* Question Schema
- question: String
- options: [String]
- correctAnswer: String
- categories: [String]
- note: String
- photoUrl: String 
 */

export interface QuestionModel {
	question: string;
	options: string[];
	correctAnswer: string;
	categories: string[];
	note?: string;
	photoUrl?: string;
	createdBy: CategoryModel[];
	_id: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CategoryModel {
	name: string;
	slug: string;
	description?: string;
	_id: string;
	createdAt: Date;
	updatedAt: Date;
}
