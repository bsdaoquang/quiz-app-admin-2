/** @format */

// modal thêm/sửa giảng viên
import { ProfessorModel } from '@/models/PropfesorModel';
import { Form, message, Modal, Input, Select, Button, InputNumber } from 'antd';
import React, { useEffect } from 'react';
import { DEPARTMENT_OPTIONS, TITLE_OPTIONS } from '../models/PropfesorModel';

interface ProfessorModalProps {
	// props nếu cần
	visible: boolean;
	onClose: () => void;
	onSave: (data: ProfessorModel) => void; // Thay 'any' bằng kiểu dữ liệu phù hợp
	professorData?: ProfessorModel; // Dữ liệu giảng viên để chỉnh sửa, nếu có
}

const ProfessorModal = (props: ProfessorModalProps) => {
	const { visible, onClose, onSave, professorData } = props;

	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();

	useEffect(() => {
		if (professorData) {
			form.setFieldsValue(professorData);
		}
	}, [professorData, form]);

	const handleSaveProfessor = async (values: any) => {};

	const handleClose = () => {
		form.resetFields();
		onClose();
	};

	return (
		<Modal
			open={visible}
			onCancel={handleClose}
			title='Giảng viên'
			onOk={() => form.submit()}
			okText={professorData ? 'Cập nhật' : 'Thêm mới'}
			cancelText='Hủy'>
			{contextHolder}

			<Form
				form={form}
				size='large'
				variant='filled'
				layout='vertical'
				onFinish={handleSaveProfessor}>
				<Form.Item
					label='Tên giảng viên'
					name='name'
					rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên' }]}>
					<Input placeholder='Nhập tên giảng viên' allowClear />
				</Form.Item>
				<div className='row'>
					<div className='col'>
						<Form.Item
							label='Học vị'
							name='title'
							rules={[{ required: true, message: 'Vui lòng chọn học vị' }]}>
							<Select
								options={TITLE_OPTIONS.map((element) => ({
									label: element,
									value: element,
								}))}
								placeholder='Chọn học vị'
								allowClear
							/>
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item
							label='Bộ môn'
							name='department'
							rules={[{ required: true, message: 'Vui lòng chọn bộ môn' }]}>
							<Select
								options={DEPARTMENT_OPTIONS.map((element) => ({
									label: element,
									value: element,
								}))}
								placeholder='Chọn bộ môn'
								allowClear
							/>
						</Form.Item>
					</div>
				</div>
				<div className='row'>
					<div className='col-4'>
						<Form.Item
							label='Số điện thoại'
							name='phone'
							rules={[
								{
									pattern: /^[0-9]{10,11}$/,
									message: 'Số điện thoại không hợp lệ',
								},
							]}>
							<Input placeholder='Nhập số điện thoại' allowClear />
						</Form.Item>
					</div>
					<div className='col'>
						<Form.Item
							label='Email'
							name='email'
							rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
							<Input placeholder='Nhập email' allowClear />
						</Form.Item>
					</div>
				</div>
			</Form>
		</Modal>
	);
};

export default ProfessorModal;
