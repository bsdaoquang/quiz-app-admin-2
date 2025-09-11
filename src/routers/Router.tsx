/** @format */

'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { FooterComponent, HeaderComponent } from '@/components';
import { Login } from '@/screens';
import {
	addAuth,
	AuthModel,
	authSelector,
} from '@/store/reducers/auth-reducer';
import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Router = ({ children }: { children: React.ReactNode }) => {
	// vào local stroage lấy token
	// gọi api /me để lấy thông tin user
	// lưu store để sử dụng

	const [isLoading, setIsLoading] = useState(true);

	const auth: AuthModel = useSelector(authSelector);
	const dispatch = useDispatch();

	useEffect(() => {
		checkLogin();
	}, []);

	const checkLogin = async () => {
		setIsLoading(true);
		try {
			const res = await handleAPI(API_NAMES.users.me);
			if (res) {
				dispatch(addAuth(res));
			}
		} catch (error) {
			console.log('error', error);
		} finally {
			setIsLoading(false);
		}
	};

	return isLoading ? (
		<div className='container py-5 text-center'>
			<Spin />
		</div>
	) : auth && auth._id && auth.accessToken ? (
		<>
			<HeaderComponent />
			<div className='main-container'>
				<div className='container-fluid ' style={{ paddingTop: 80 }}>
					{children}
				</div>
			</div>
			<FooterComponent />
		</>
	) : (
		<Login />
	);
};

export default Router;
