/** @format */

'use client';

import { HeadComponent } from '@/components';
import { Button } from 'antd';
import { FaUserTie } from 'react-icons/fa6';
// trang quản lý giảng viên

import React, { useState } from 'react';
import { ProfessorModel } from '@/models/PropfesorModel';
import ProfessorModal from '@/modals/ProfessorModal';

const Profresors = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [professors, setProfessors] = useState<ProfessorModel[]>([]);
	const [isAddProfessor, setIsAddProfessor] = useState(false);

	return (
		<div className='container'>
			<HeadComponent
				title='Quản lý giảng viên'
				rightContent={
					<Button
						type='link'
						icon={<FaUserTie size={20} />}
						onClick={() => setIsAddProfessor(true)}
						size='small'>
						Thêm giảng viên
					</Button>
				}
			/>

			<ProfessorModal
				visible={isAddProfessor}
				onClose={() => setIsAddProfessor(false)}
				onSave={(val) => {
					console.log('val', val);
				}}
			/>
		</div>
	);
};

export default Profresors;
