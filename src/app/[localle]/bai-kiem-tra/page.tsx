/** @format */
'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { AuthModel } from '@/models/AuthModel';
import { authSelector } from '@/store/reducers/auth-reducer';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TestsPage = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [tests, setTests] = useState<any[]>([]);
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

	return <div>Tests</div>;
};

export default TestsPage;
