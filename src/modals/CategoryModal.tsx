/** @format */

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { CategoryModel } from '@/models/QuestionModel';
import { replaceName } from '@/utils/replaceName';
import { Form, Input, Modal } from 'antd';
import React from 'react';

interface CategoryModalProps {
	visible: boolean;
	onClose: () => void;
	onFinish: (val: CategoryModel) => void;
	category?: CategoryModel;
}

const CategoryModal = (props: CategoryModalProps) => {
	const { visible, onClose, onFinish, category } = props;

	const [form] = Form.useForm();

	const handleCategory = async (values: {
		name: string;
		description: string;
	}) => {
		const data = {
			...values,
			id: category?._id,
			slug: replaceName(values.name),
			description: values.description || '',
		};

		try {
			const res = await handleAPI(API_NAMES.questions.category, data, 'post');
			onFinish(res);
			handleClose();
		} catch (error) {
			console.log('Failed to create category:', error);
		}
	};

	const handleClose = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			open={visible}
			onCancel={handleClose}
			onOk={() => form.submit()}
			title='Add New Category'>
			<Form
				form={form}
				layout='vertical'
				onFinish={handleCategory}
				variant='filled'>
				<Form.Item
					name='name'
					label='Category Name'
					rules={[{ required: true, message: 'Please enter category name' }]}>
					<Input allowClear placeholder='Enter category name' />
				</Form.Item>
				<Form.Item name='description' label='Description'>
					<Input.TextArea allowClear placeholder='Enter description' rows={4} />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CategoryModal;
