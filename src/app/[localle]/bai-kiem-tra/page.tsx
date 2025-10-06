/** @format */
'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { AddTest } from '@/modals';
import { AuthModel } from '@/models/AuthModel';
import { authSelector } from '@/store/reducers/auth-reducer';
import { Button, Flex, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TestsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [tests, setTests] = useState<any[]>([]);
	const [isAddNewTest, setIsAddNewTest] = useState(false);
	const [pageData, setPageData] = useState({
		page: 1,
		limit: 10,
	});
	const [total, setTotal] = useState(0);
	const [api, setApi] = useState('');

	const auth: AuthModel = useSelector(authSelector);

	useEffect(() => {
		setApi(
			`${API_NAMES.tests.getAll}?page=${pageData.page}&limit=${pageData.limit}&userId=${auth._id}`
		);
	}, [pageData]);

	useEffect(() => {
		if (api) {
			getAllTests(api);
		}
	}, [api]);

	const getAllTests = async (url: string) => {
		setIsLoading(true);
		try {
			const response = await handleAPI(url);

			setTests(response.tests);
			setTotal(response.total);
		} catch (error) {
			console.error('Error fetching tests:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const columns = [
		{
			title: 'Tên bài kiểm tra',
			dataIndex: 'title',
			key: 'title	',
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			key: 'description',
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => new Date(date).toLocaleDateString(),
		},
		{
			title: 'Tác vụ',
			key: 'action',
			render: (_: any, record: any) => (
				<Flex gap={8}>
					<Button type='link'>Sửa</Button>
					<Button type='link' danger>
						Xóa
					</Button>
				</Flex>
			),
		},
	];

	return (
		<div>
			<div className='py-2'>
				<Flex>
					<div>
						<Typography.Title level={2}>
							Danh sách bài kiểm tra
						</Typography.Title>
					</div>
					<Button
						type='primary'
						onClick={() => setIsAddNewTest(true)}
						className='ms-auto'>
						Tạo bài kiểm tra
					</Button>
				</Flex>
			</div>

			<Table
				dataSource={tests}
				columns={columns}
				loading={isLoading}
				pagination={{
					total,
					current: pageData.page,
					pageSize: pageData.limit,
					onChange: (page, pageSize) => setPageData({ page, limit: pageSize }),
				}}
			/>
			<AddTest visible={isAddNewTest} onClose={() => setIsAddNewTest(false)} />
		</div>
	);
};

export default TestsPage;
