/** @format */

'use client';

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { addAuth } from '@/store/reducers/auth-reducer';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const Login = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isVerifyCode, setIsVerifyCode] = useState('');
	const [is2FA, setIs2FA] = useState(false);
	const [uid, setUid] = useState<string | undefined>();

	const [form] = Form.useForm();
	const [messageAPI, messageHolder] = message.useMessage();
	const dispatch = useDispatch();

	const handleLogin = async (values: {
		username: string;
		password: string;
	}) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(API_NAMES.users.login, values, 'post');
			if (res && res.accessToken) {
				localStorage.setItem('accessToken', res.accessToken);
				dispatch(addAuth(res));
			} else {
				setIs2FA(true);
				setUid(res._id);
			}
		} catch (error) {
			console.log(error);
			messageAPI.error('Login failed. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		form.resetFields();
	};

	const handleVerify = async () => {
		setIsLoading(true);
		try {
			const res = await handleAPI(
				API_NAMES.users.verifyCode,
				{ userId: uid, code: isVerifyCode },
				'post'
			);
			localStorage.setItem('accessToken', res.accessToken);
			dispatch(addAuth(res));
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container-fluid'>
			{messageHolder}
			<div className='container'>
				<div className='row'>
					<div className='col-sm-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
						{is2FA ? (
							<Card className='my-5 p-3' variant='borderless'>
								<Typography.Title type='secondary' level={2} className=' mb-1'>
									Two-Factor Authentication
								</Typography.Title>
								<Typography.Paragraph>
									Please enter the verification code sent to your email.
								</Typography.Paragraph>

								<div className='text-center mt-4'>
									<Input.OTP
										onChange={(value) => setIsVerifyCode(value)}
										size='large'
									/>
								</div>

								<Button
									disabled={isVerifyCode.length < 6}
									block
									loading={isLoading}
									onClick={() => handleVerify()}
									type='primary'
									size='large'
									className='w-100 mt-5'>
									Verify
								</Button>
							</Card>
						) : (
							<Card className='my-5' variant='borderless'>
								<Typography.Title type='secondary' level={2} className=' mb-1'>
									Login
								</Typography.Title>
								<Typography.Paragraph>
									Welcome back! Please enter your details.
								</Typography.Paragraph>

								<div className='my-4'>
									<Form
										disabled={isLoading}
										form={form}
										layout='vertical'
										variant='filled'
										size='large'
										onFinish={handleLogin}
										onReset={handleClose}>
										<Form.Item
											label='Username'
											name='username'
											rules={[
												{
													required: true,
													message: 'Please input your username!',
												},
												() => ({
													validator(_, value) {
														if (!value || value.trim() === '') {
															return Promise.reject(
																new Error('Username cannot be empty or blank')
															);
														}
														const usernameRegex = /^[a-z0-9]{3,20}$/;
														if (!usernameRegex.test(value)) {
															return Promise.reject(
																new Error(
																	'Username must be 3-20 characters, lowercase, no special characters or spaces.'
																)
															);
														}
														return Promise.resolve();
													},
												}),
											]}>
											<Input
												allowClear
												min={3}
												max={20}
												showCount
												autoCapitalize='none'
												type='default'
												placeholder='Enter your username'
											/>
										</Form.Item>

										<Form.Item
											label='Password'
											name='password'
											rules={[
												{
													required: true,
													message: 'Please input your password!',
												},
											]}>
											<Input.Password placeholder='Enter your password' />
										</Form.Item>
									</Form>
								</div>
								<Button
									block
									loading={isLoading}
									onClick={() => form.submit()}
									type='primary'
									size='large'
									className='w-100 my-3'>
									Login
								</Button>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
