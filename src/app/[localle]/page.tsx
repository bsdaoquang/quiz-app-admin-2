/** @format */

'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { AuthModel } from '@/models/AuthModel';
import {
	authSelector,
	removeAuth,
	updateAuth,
} from '@/store/reducers/auth-reducer';
import { Button, Switch } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Home = () => {
	const auth: AuthModel = useSelector(authSelector);

	const dispatch = useDispatch();

	// handle 2FA login flow
	const handle2FALogin = async () => {
		let enable2FA = auth.isF2AEnabled;
		// call api to update user
		if (!enable2FA) {
			// check existing email
			if (!auth?.email) return alert('Please update email to enable 2FA');
			// enable 2FA
			enable2FA = true;
		} else {
			// disable 2FA
			enable2FA = false;
		}

		// update redux and api user
		try {
			await handleAPI(
				`${API_NAMES.users.update}/${auth?._id}`,
				{ isF2AEnabled: enable2FA },
				'put'
			);
			dispatch(updateAuth({ isF2AEnabled: enable2FA }));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			<div>Admin Home {auth?.username}</div>
			<Button type='link' onClick={() => dispatch(removeAuth({}))}>
				Logout
			</Button>

			<Switch checked={auth?.isF2AEnabled} onChange={handle2FALogin} />

			<div className='mt-4'>
				<Button
					type='primary'
					onClick={async () => {
						try {
							const res = await handleAPI(
								`${API_NAMES.admin.createPermission}`,
								{},
								'post'
							);

							console.log(res);
						} catch (error) {
							console.log(error);
						}
					}}>
					Go to User Management
				</Button>
			</div>
		</div>
	);
};

export default Home;
