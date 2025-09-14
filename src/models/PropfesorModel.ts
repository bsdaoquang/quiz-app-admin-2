/** @format */

/*
	Professor model interface
	giảng viên có thể tạo và quản lý câu hỏi, bài kiểm tra, xem kết quả bài kiểm tra
	giảng viên có thể quản lý thông tin cá nhân, bao gồm tên, email, số điện thoại, khoa, chức vụ, ảnh đại diện và trạng thái hoạt động
	Giảng viên có thể được liên kết với nhiều khóa học và có thể xem danh sách các khóa học mà họ đang giảng dạy
	Giảng viên có thể quản lý được sinh viên

*/

export const DEPARTMENT_OPTIONS = [
	'Computer Science',
	'Mathematics',
	'Physics',
	'Chemistry',
	'Biology',
	'English',
	'History',
	'Economics',
	'Engineering',
	'Business',
];

export const TITLE_OPTIONS = [
	'Professor',
	'Associate Professor',
	'Assistant Professor',
	'Lecturer',
	'Senior Lecturer',
	'Instructor',
	'Adjunct Professor',
	'Visiting Professor',
];

export interface ProfessorModel {
	name: string;
	email: string;
	phone?: string;
	department: string;
	title?: string; // e.g., Associate Professor, Lecturer
	avatarUrl?: string;
	createdAt: Date;
	updatedAt: Date;
	uid: string; // reference to User ID
	isActive: boolean;
	username: string;
	ageOfExperience?: number; // in years
	bio?: string; // short biography
	coursesTaught?: string[]; // list of course IDs or names
	studentCount?: number; // number of students managed
	rated?: number; // average rating from students
	reviewsCount?: number; // number of reviews received
	_id?: string; // MongoDB specific field
}
