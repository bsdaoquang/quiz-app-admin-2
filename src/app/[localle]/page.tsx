/** @format */

'use client';

import { authSelector, removeAuth } from '@/store/reducers/auth-reducer';
import { Button } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
	const auth = useSelector(authSelector);

	const dispatch = useDispatch();

	return (
		<div>
			<div>Admin Home {auth.user?.username}</div>
			<Button type='link' onClick={() => dispatch(removeAuth({}))}>
				Logout
			</Button>
		</div>
	);
};

export default Home;
