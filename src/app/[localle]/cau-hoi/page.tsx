/** @format */
// Question Page, manage questions

'use client';

import handleAPI from '@/apis/handleAPI';
import { QuestionModel } from '@/models/QuestionModel';
import { ColumnProps } from 'antd/es/table';
import React, { useEffect, useState } from 'react';

import { Button, Flex, Modal, Table, Typography } from 'antd';
import { API_NAMES } from '@/apis/apiNames';
import { QuestionModal } from '@/modals';
import { IoAdd } from 'react-icons/io5';
import { PlusCircleFilled } from '@ant-design/icons';

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
	const [isVisibleQuestionModal, setIsVisibleQuestionModal] = useState(false);
	const [questionSelected, setQuestionSelected] = useState<QuestionModel>();

	const [modalAPI, modalContext] = Modal.useModal();

	useEffect(() => {
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
			<div className='pt-3'>
				<Flex justify='space-between'>
					<div>
						<Typography.Title level={4}>Quản lý câu hỏi</Typography.Title>
					</div>
					<div className='text-end'>
						<Button
							icon={<PlusCircleFilled />}
							onClick={() => setIsVisibleQuestionModal(true)}
							type='primary'>
							Add new Question
						</Button>
					</div>
				</Flex>
			</div>
			{modalContext}
			<div className='pb-4'>
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

			<QuestionModal
				visible={isVisibleQuestionModal}
				onClose={() => {
					setIsVisibleQuestionModal(false);
					setQuestionSelected(undefined);
				}}
				question={questionSelected}
				onFinish={(val) => {
					console.log(val);
				}}
			/>
		</div>
	);
};

export default Questions;
