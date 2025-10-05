/** @format */

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { CategoryModel, QuestionModel } from '@/models/QuestionModel';
import { replaceName } from '@/utils/replaceName';
import { PlusOutlined } from '@ant-design/icons';
import {
	Button,
	Form,
	Input,
	message,
	Modal,
	Radio,
	Select,
	Upload,
	UploadFile,
} from 'antd';
import React, { useEffect, useState } from 'react';
import CategoryModal from './CategoryModal';
import { HandleFile } from '@/utils/handleFile';
import { RcFile } from 'antd/es/upload';

interface QuestionModalProps {
	visible: boolean;
	onClose: () => void;
	question?: QuestionModel;
	onFinish: (question: QuestionModel) => void;
}

const QuestionModal = (props: QuestionModalProps) => {
	const { visible, onClose, question, onFinish } = props;

	const [filelists, setFilelists] = useState<UploadFile[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [categories, setCategories] = useState<CategoryModel[]>([]);
	const [isAddCategory, setIsAddCategory] = useState(false);
	const [options, setOptions] = useState<any>();

	/*
    question: string;
	options: string[];
	correctAnswer: string;
	categories: string[];
	note?: string;
	photoUrl?: string;
	createdBy: string;
  */

	const [form] = Form.useForm();

	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		if (visible && question) {
			// do something
		}
	}, [visible, question]);

	const getCategories = async () => {
		try {
			const res = await handleAPI(API_NAMES.questions.getCategories);
			setCategories(res);
		} catch (error) {
			console.log('Failed to fetch categories:', error);
		}
	};

	const handleAddNewQuestion = async (values: {
		question: string;
		options: string[];
		correctAnswer: string;
		categories: string[];
		note?: string;
	}) => {
		const data = {
			...values,
			photoUrl: await HandleFile.Upload(filelists[0].originFileObj as RcFile),
			// photoUrl: filelists[0] && filelists[0].originFileObj ? await uploadImage(filelists[0].originFileObj) : '',
			id: question?._id,
			categories: values.categories
				? values.categories.filter(
						(element) => element && element.trim() !== ''
				  ) || []
				: [],
			options: options ? Object.values(options).filter((option) => option) : [],
			note: values.note || '',
			correctAnswer: options ? options[values.correctAnswer] : '',
			slug: replaceName(values.question),
		};

		if (data.photoUrl || data.question) {
			try {
				setIsLoading(true);
				const res = await handleAPI(
					API_NAMES.questions.handleQuestions,
					data,
					'post'
				);
				onFinish(res);
				handleClose();
			} catch (error) {
				console.log('Failed to add question:', error);
			} finally {
				setIsLoading(false);
			}
		} else {
			message.error('Please upload photo or enter question');
		}
	};

	const handleClose = () => {
		form.resetFields();
		setFilelists([]);
		onClose();
	};

	return (
		<>
			<Modal
				open={visible}
				onCancel={handleClose}
				title='Question'
				onOk={() => form.submit()}
				loading={isLoading}>
				<Form
					size='large'
					variant='filled'
					layout='vertical'
					form={form}
					onFinish={handleAddNewQuestion}>
					<Form.Item label='Photo'>
						<Upload.Dragger
							fileList={filelists}
							onChange={(info) => setFilelists(info.fileList)}
							multiple={false}
							maxCount={1}
							onRemove={() => {
								setFilelists([]);
								form.setFieldValue('photoUrl', '');
							}}
							beforeUpload={(file) => {
								const isLt5M = file.size / 1024 / 1024 < 5;
								if (!isLt5M) {
									Modal.error({
										title: 'File too large',
										content: 'Image must be smaller than 5MB!',
									});
								}
								return isLt5M;
							}}
							accept='image/*'>
							<p className='ant-upload-drag-icon'>
								Drag & drop or click to upload
							</p>
						</Upload.Dragger>
					</Form.Item>
					<Form.Item name='question' label='Question'>
						<Input.TextArea placeholder='Enter question' allowClear rows={4} />
					</Form.Item>
					<Form.Item name={'categories'} label='Categories'>
						<Select
							mode='multiple'
							placeholder='Select categories'
							allowClear
							showSearch
							filterOption={(input, option) =>
								option?.key ? option.key.includes(replaceName(input)) : false
							}
							options={categories.map((category) => ({
								label: category.name,
								key: category.slug,
								value: category._id,
							}))}
							popupRender={(menu) => (
								<div>
									{menu}{' '}
									<div className='text-end py-2'>
										<Button
											onClick={() => setIsAddCategory(true)}
											icon={<PlusOutlined />}
											type='link'
											size='small'>
											Add Category
										</Button>
									</div>
								</div>
							)}
						/>
					</Form.Item>
					{Array.from({ length: 5 }).map((_, index) => (
						<Form.Item
							layout='horizontal'
							key={index}
							name={['options', index]}
							label={`Option ${index + 1}`}
							rules={[
								{
									required: true && index < 2,
									message: `Please enter option ${index + 1}`,
								},
							]}>
							<Input
								onChange={(val) =>
									val.target.value
										? setOptions((prev: any) => ({
												...prev,
												[`option${index + 1}`]: val.target.value,
										  }))
										: setOptions((prev: any) => {
												const updated = { ...prev };
												delete updated[`option${index + 1}`];
												return updated;
										  })
								}
								placeholder={`Enter option ${index + 1}`}
								allowClear
							/>
						</Form.Item>
					))}
					<Form.Item
						name='correctAnswer'
						label='Correct Answer'
						className='m-0'
						rules={[
							{ required: true, message: 'Please enter correct answer' },
						]}>
						<Radio.Group>
							{Array.from({
								length: Object.keys(options || {}).length || 0,
							}).map((_, index) => (
								<Radio key={index} value={`option${index + 1}`}>
									Option {index + 1}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
					<Form.Item name='note' label='Note'>
						<Input.TextArea placeholder='Enter note' allowClear rows={4} />
					</Form.Item>
				</Form>
			</Modal>
			<CategoryModal
				visible={isAddCategory}
				onClose={() => setIsAddCategory(false)}
				onFinish={(val) => {
					setCategories((prev) => [...prev, val]);
					form.setFieldValue('categories', [
						...(form.getFieldValue('categories') || []),
						val._id,
					]);
					setIsAddCategory(false);
				}}
			/>
		</>
	);
};

export default QuestionModal;
