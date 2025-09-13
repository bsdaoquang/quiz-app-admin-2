/** @format */

'use client';

import { Affix, Layout, Menu } from 'antd';
import { useLocale } from 'next-intl';
import { getLocale } from 'next-intl/server';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useTranslations } from 'use-intl';

const { Sider } = Layout;

const SiderComponent = () => {
	const l = useLocale(); // vi, en
	const router = useRouter();
	const t = useTranslations('HomeScreen');

	const menus =
		l === 'vi'
			? [
					{
						key: 'dashboard',
						label: 'Bảng điều khiển',
						path: '/bang-dieu-khien',
					},
					{
						key: 'quizzes',
						label: 'Bài kiểm tra',
						path: '/bai-kiem-tra',
					},
					{
						key: 'questions',
						label: 'Câu hỏi',
						path: '/cau-hoi',
					},
					{
						key: 'students',
						label: 'Học sinh',
						path: '/hoc-sinh',
					},
					{
						key: 'teachers',
						label: 'Giảng viên',
						path: '/giang-vien',
					},
					{
						key: 'settings',
						label: 'Cài đặt',
						path: '/cai-dat',
					},
			  ]
			: [
					{
						key: 'dashboard',
						label: 'Dashboard',
						path: '/dashboard',
					},
					{
						key: 'quizzes',
						label: 'Quizzes',
						path: '/quizzes',
					},
					{
						key: 'questions',
						label: 'Questions',
						path: '/questions',
					},
					{
						key: 'students',
						label: 'Students',
						path: '/students',
					},
					{
						key: 'teachers',
						label: 'Teachers',
						path: '/teachers',
					},
					{
						key: 'settings',
						label: 'Settings',
						path: '/settings',
					},
			  ];

	return (
		<Affix offsetTop={0}>
			<Sider
				style={{
					minHeight: '100vh',
				}}
				className='pt-5 px-1'
				breakpoint='sm'
				collapsedWidth='0'
				width={280}>
				<Menu
					onClick={(e) => {
						// console.log('click ', e);
						const menu = menus.find((menu) => menu.key === e.key);
						if (menu) {
							router.push(`${l}${menu.path}`);
						}
					}}
					theme='dark'
					mode='inline'
					style={{ height: '100%', borderRight: 0 }}
					items={menus.map((menu) => ({
						key: menu.key,
						label: menu.label,
					}))}
				/>
			</Sider>
		</Affix>
	);
};

export default SiderComponent;
