/** @format */

import { Affix, Layout, Typography } from 'antd';

const HeaderComponent = () => {
	return (
		<Affix offsetTop={0}>
			<Typography.Title level={3} className='m-0 px-2 py-3 bg-dark text-white'>
				Header
			</Typography.Title>
		</Affix>
	);
};

export default HeaderComponent;
