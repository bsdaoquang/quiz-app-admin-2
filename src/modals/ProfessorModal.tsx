/** @format */

// modal thêm/sửa giảng viên
import { ProfessorModel } from '@/models/PropfesorModel';
import {
	Form,
	message,
	Modal,
	Input,
	Select,
	Button,
	InputNumber,
	Divider,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { DEPARTMENT_OPTIONS, TITLE_OPTIONS } from '../models/PropfesorModel';
import handleAPI from '@/apis/handleAPI';
import { API_NAMES } from '@/apis/apiNames';

interface ProfessorModalProps {
	// props nếu cần
	visible: boolean;
	onClose: () => void;
	onSave: (data: ProfessorModel) => void; // Thay 'any' bằng kiểu dữ liệu phù hợp
	professorData?: ProfessorModel; // Dữ liệu giảng viên để chỉnh sửa, nếu có
}

const ProfessorModal = (props: ProfessorModalProps) => {
	const { visible, onClose, onSave, professorData } = props;

	const [isLoading, setIsLoading] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();
	const [form] = Form.useForm();

	useEffect(() => {
		if (professorData) {
			form.setFieldsValue(professorData);
		}
	}, [professorData, form]);

	const handleSaveProfessor = async (values: any) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(API_NAMES.professors.create, values, 'post');
			messageApi.success('Lưu giảng viên thành công');
			onSave(res);
			handleClose();
		} catch (error) {
			console.log(error);
			messageApi.error('Lỗi khi lưu giảng viên');
		} finally {
			setIsLoading(false);
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
				<Form.Item label='Số năm kinh nghiệm' name='ageOfExperience'>
					<InputNumber min={1} />
				</Form.Item>
				<Form.Item label='Tiểu sử' name='bio'>
					<Input.TextArea rows={4} placeholder='Nhập tiểu sử' allowClear />
				</Form.Item>
				<Divider />
				<Form.Item name={'username'} label='Tên đăng nhập'>
					<Input placeholder='Nhập tên đăng nhập' allowClear />
				</Form.Item>
				<Form.Item name={'password'} label='Mật khẩu'>
					<Input placeholder='Nhập mật khẩu' allowClear />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ProfessorModal;
