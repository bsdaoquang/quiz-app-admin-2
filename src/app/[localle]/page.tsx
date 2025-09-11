/** @format */

'use client';

import { authSelector } from '@/store/reducers/auth-reducer';
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
	const auth = useSelector(authSelector);

	return <div>Home</div>;
};

export default Home;
