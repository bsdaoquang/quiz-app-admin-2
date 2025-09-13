/** @format */

import { Flex, Typography } from 'antd';
import React from 'react';

export interface HeadComponentProps {
	title: string;
	description?: string;
	rightContent?: React.ReactNode;
}

const HeadComponent = (props: HeadComponentProps) => {
	const { title, description, rightContent } = props;
	return (
		<Flex justify='space-between' align='center' className='mb-3'>
			<div className='py-2'>
				{title && (
					<Typography.Title level={3} className='mb-1'>
						{title}
					</Typography.Title>
				)}
				{description && (
					<Typography.Text type='secondary'>{description}</Typography.Text>
				)}
			</div>
			{rightContent && <div>{rightContent}</div>}
		</Flex>
	);
};

export default HeadComponent;
