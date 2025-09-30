/** @format */
// Question Page, manage questions

'use client';

import handleAPI from '@/apis/handleAPI';
import { QuestionModel } from '@/models/QuestionModel';
import { ColumnProps } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import { Button, Modal, Table } from 'antd';
import { API_NAMES } from '@/apis/apiNames';

const Questions = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [questions, setQuestions] = useState<QuestionModel[]>([]);
	const [pageDatas, setPageDatas] = useState({
		page: 1,
		pageSize: 20,
		search: '',
		category: '',
		createdBy: '',
	});
	const [total, setTotal] = useState(0);
	const [api, setApi] = useState('');
	const [selectedKey, setSelectedKey] = useState<React.Key[]>([]);

	const [modalAPI, modalContext] = Modal.useModal();

	useEffect(() => {
		// setApi based on pageDatas
		const { page, pageSize, search, category, createdBy } = pageDatas;
		let url = `${API_NAMES.questions.get}?page=${page}&pageSize=${pageSize}`;
		if (search) {
			url += `&search=${search}`;
		}
		if (category) {
			url += `&category=${category}`;
		}
		if (createdBy) {
			url += `&createdBy=${createdBy}`;
		}
		setApi(url);
	}, [pageDatas]);

	useEffect(() => {
		if (!api) return;
		getQuestions(api);
	}, [api]);

	const getQuestions = async (url: string) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(url);
			setQuestions(res.questions);
			setTotal(res.total);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	/*
		{
    "_id": "68dc016aa5ef698030da4d30",
    "question": "Cơ quan nào sản xuất hormone somatostatin?",
    "options": [
        "Tuyến tụy",
        "Tuyến giáp",
        "Tuyến yên",
        "Tuyến thượng thận"
    ],
    "correctAnswer": "Tuyến tụy",
    "categories": [
        "Sinh lý học",
        "Nội tiết"
    ],
    "note": "Somatostatin ức chế tiết hormone tăng trưởng và insulin.",
    "photoUrl": "",
    "__v": 0,
    "createdAt": "2025-09-30T16:12:26.365Z",
    "updatedAt": "2025-09-30T16:12:26.365Z"
}
	*/

	const columns: ColumnProps<QuestionModel>[] = [
		{
			title: 'No',
			render: (_, __, index) => index + 1,
		},
		{
			title: 'Câu hỏi',
			dataIndex: 'question',
			key: 'question',
		},

		{
			title: 'Đáp án đúng',
			dataIndex: 'correctAnswer',
			key: 'correctAnswer',
		},

		{
			title: 'Tùy chọn',
			dataIndex: 'options',
			key: 'options',
			render: (options: string[]) => options.join(', '),
		},

		{
			title: 'Danh mục',
			dataIndex: 'categories',
			key: 'categories',
			render: (categories: string[]) => categories.join(', '),
		},

		{
			title: 'Ghi chú',
			dataIndex: 'note',
			key: 'note',
		},
	];

	const handleDeleteQuestions = async () => {
		if (selectedKey.length === 0) return;
		setIsLoading(true);
		try {
			await handleAPI(
				API_NAMES.questions.deleteMany,
				{ ids: selectedKey },
				'delete'
			);
			// Refresh questions
			getQuestions(api);
			setSelectedKey([]);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container'>
			{modalContext}
			<div className='py-4'>
				{selectedKey.length > 0 && (
					<Button
						type='text'
						danger
						onClick={() =>
							modalAPI.confirm({
								title: 'Xác nhận xóa',
								content: `Bạn có chắc chắn muốn xóa ${selectedKey.length} câu hỏi đã chọn không?`,
								okText: 'Xóa',
								okType: 'danger',
								cancelText: 'Hủy',
								onOk: handleDeleteQuestions,
							})
						}>
						Xóa {selectedKey.length} câu hỏi
					</Button>
				)}
			</div>
			<Table
				dataSource={questions}
				columns={columns}
				loading={isLoading}
				rowSelection={{
					selectedRowKeys: selectedKey,
					onChange: (selectedRowKeys) => setSelectedKey(selectedRowKeys),
					align: 'center',
				}}
				pagination={{
					total,
					size: 'small',
					pageSize: pageDatas.pageSize,
					current: pageDatas.page,
					onChange: (page, pageSize) =>
						setPageDatas({ ...pageDatas, page, pageSize }),
				}}
				rowKey='_id'
			/>
		</div>
	);
};

export default Questions;
