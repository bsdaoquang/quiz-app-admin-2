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
	createdBy: string;
	_id: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
}
