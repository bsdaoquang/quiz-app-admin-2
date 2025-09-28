/** @format */

export enum Role {
	Teacher = 'teacher',
	Student = 'student',
	Admin = 'admin',
}

export interface AuthModel {
	_id: string;
	email: string;
	name: string;
	accessToken: string;
	role: 'teacher' | 'student' | 'admin';
	refreshToken: string;
	photoUrl?: string;
	isF2AEnabled?: boolean;
	username?: string;
}
