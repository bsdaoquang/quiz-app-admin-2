/** @format */

'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { FooterComponent, HeaderComponent, SiderComponent } from '@/components';
import { Login } from '@/screens';
import { addAuth, authSelector } from '@/store/reducers/auth-reducer';
import { themes } from '@/styles/themes';
import { ConfigProvider, Layout, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Router = ({ children }: { children: React.ReactNode }) => {
	// vào local stroage lấy token
	// gọi api /me để lấy thông tin user
	// lưu store để sử dụng

	const [isLoading, setIsLoading] = useState(true);

	const auth = useSelector(authSelector);
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
		<ConfigProvider theme={themes}>
			<Layout style={{ minHeight: '100vh' }} className='bg-light'>
				<SiderComponent />
				<Layout>
					<HeaderComponent />
					<Layout.Content>
						<div className='main-container'>
							<div className='container-fluid'>{children}</div>
						</div>
					</Layout.Content>
					<FooterComponent />
				</Layout>
			</Layout>
		</ConfigProvider>
	) : (
		<Login />
	);
};

export default Router;
