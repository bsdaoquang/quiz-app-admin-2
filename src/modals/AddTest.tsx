/** @format */

import { API_NAMES } from '@/apis/apiNames';
import handleAPI from '@/apis/handleAPI';
import { AuthModel } from '@/models/AuthModel';
import { CategoryModel, QuestionModel } from '@/models/QuestionModel';
import { TestModel } from '@/models/TestModel';
import { authSelector } from '@/store/reducers/auth-reducer';
import { replaceName } from '@/utils/replaceName';
import {
	Button,
	Card,
	Checkbox,
	Drawer,
	Empty,
	Form,
	Input,
	InputNumber,
	List,
	Select,
	Space,
	Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface AddTestProps {
	visible: boolean;
	onClose: () => void;
	test?: TestModel;
	onSave?: (data: TestModel) => void;
}

const AddTest = (props: AddTestProps) => {
	const { visible, onClose, test, onSave } = props;

	const [categories, setCategories] = useState<CategoryModel[]>([]);
	const [questions, setQuestions] = useState<QuestionModel[]>([]);
	const [results, setResults] = useState<QuestionModel[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [categorySelected, setCategorySelected] = useState<
		string | undefined
	>();
	const [questionSelected, setQuestionSelected] = useState<string[]>([]);
	const [isHandleTest, setIsHandleTest] = useState<boolean>(false);

	const auth: AuthModel = useSelector(authSelector);
	const [form] = Form.useForm();

	useEffect(() => {
		getAllCategories();
	}, []);

	useEffect(() => {
		if (categorySelected) {
			getQuestionsByCategory(categorySelected);
		} else {
			setQuestions([]);
			setResults([]);
		}
	}, [categorySelected]);

	const getQuestionsByCategory = async (categoryId: string) => {
		setIsLoading(true);
		try {
			const res = await handleAPI(
				`${API_NAMES.questions.get}?category=${categoryId}`
			);
			setQuestions(res.questions);
			setResults(res.questions);
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	const getAllCategories = async () => {
		try {
			const res = await handleAPI(API_NAMES.questions.getCategories);
			setCategories(res);
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddTest = async (values: any) => {
		const data = {
			_id: test?._id,
			...values,
			questions: questionSelected,
			createdBy: auth._id,
			slug: replaceName(values.title),
		};
		setIsHandleTest(true);
		try {
			const res = await handleAPI(API_NAMES.tests.create, data, 'post');
			onSave && onSave(res);
			handleClose();
		} catch (error) {
			console.log(error);
		} finally {
			setIsHandleTest(false);
		}
	};

	const handleClose = () => {
		onClose();
		form.resetFields();
		setQuestionSelected([]);
		setCategorySelected(undefined);
	};

	const handleAddRandomQuestions = (num: number) => {
		setQuestionSelected([]);
		if (num > results.length) {
			num = results.length;
		}
		const shuffled = [...results].sort(() => 0.5 - Math.random());
		const selected = shuffled.slice(0, num).map((q) => q._id);
		setQuestionSelected((prev) => Array.from(new Set([...prev, ...selected])));
	};

	return (
		<Drawer
			loading={isHandleTest}
			open={visible}
			onClose={handleClose}
			placement='right'
			width={'100vw'}
			title={test ? 'Cập nhật bài kiểm tra' : 'Thêm bài kiểm tra'}
			extra={
				<Space>
					<Button onClick={handleClose}>Hủy</Button>
					<Button type='primary' className='px-5' onClick={() => form.submit()}>
						{test ? 'Cập nhật' : 'Lưu'}
					</Button>
				</Space>
			}>
			<div className='container-fluid'>
				<div className='container'>
					<div className='row'>
						<div className='col'>
							<Form
								form={form}
								variant='filled'
								layout='vertical'
								onFinish={handleAddTest}
								size='large'>
								<Form.Item
									label='Tên bài kiểm tra'
									name='title'
									rules={[
										{
											required: true,
											message: 'Vui lòng nhập tên bài kiểm tra',
										},
									]}>
									<Input placeholder='Nhập tên bài kiểm tra' allowClear />
								</Form.Item>
								<Form.Item label='Mô tả' name='description'>
									<Input.TextArea
										rows={4}
										placeholder='Nhập mô tả'
										allowClear
									/>
								</Form.Item>
								<Form.Item label='Danh mục' name='categoryId'>
									<Select
										disabled={isLoading || questionSelected.length > 0}
										showSearch
										filterOption={(input, option) =>
											(option?.key ?? '').includes(replaceName(input))
										}
										placeholder='Chọn danh mục'
										allowClear
										options={categories.map((item) => ({
											label: item.name,
											value: item._id,
											key: item.slug,
										}))}
										onChange={(value) => setCategorySelected(value)}
									/>
								</Form.Item>
							</Form>
							<div className='mt-4'>
								<Typography.Paragraph strong>
									Danh sách câu hỏi
								</Typography.Paragraph>
								{questionSelected.length > 0 ? (
									<List
										footer={
											<>
												<Typography.Text>
													Tổng số câu hỏi đã chọn: {questionSelected.length}
												</Typography.Text>
												<Button
													type='link'
													onClick={() => {
														setQuestionSelected([]);
													}}>
													Xóa tất cả
												</Button>
											</>
										}
										style={{
											maxHeight: 'calc(100vh - 550px)',
											overflowY: 'auto',
										}}
										dataSource={questionSelected}
										renderItem={(id) => (
											<List.Item
												extra={
													<Button
														type='link'
														danger
														size='small'
														onClick={() => {
															setQuestionSelected((prev) =>
																prev.filter((qId) => qId !== id)
															);
														}}>
														Xóa
													</Button>
												}>
												{questions.find((q) => q._id === id)?.question ||
													'Câu hỏi không tồn tại'}
											</List.Item>
										)}
									/>
								) : (
									<Empty description='Chưa có câu hỏi được chọn' />
								)}
							</div>
						</div>
						<div className='col'>
							<Card
								loading={isLoading}
								size='small'
								title='Danh sách câu hỏi'
								extra={<Button type='link'>Thêm câu hỏi</Button>}>
								<div style={{ width: '100%' }}>
									<Checkbox.Group
										style={{ width: '100%' }}
										value={questionSelected}
										onChange={(value) =>
											setQuestionSelected(value as string[])
										}>
										<List
											locale={{
												emptyText:
													'Chưa có câu hỏi, chọn chuyên mục để lấy danh sách câu hỏi phù hợp',
											}}
											header={
												<div>
													<Input.Search
														style={{ width: '100%' }}
														placeholder='Tìm câu hỏi'
														allowClear
														onSearch={(value) => {
															if (!value) {
																setResults(questions);
																return;
															}
															const filtered = questions.filter((q) =>
																q.slug.includes(replaceName(value))
															);
															setResults(filtered);
														}}
														onClear={() => setResults(questions)}
													/>

													<Space className='mt-2'>
														<Typography.Text>Chọn ngẫu nhiên: </Typography.Text>
														<Button
															onClick={() => handleAddRandomQuestions(20)}>
															20 câu
														</Button>
														<Button
															onClick={() => handleAddRandomQuestions(50)}>
															50 câu
														</Button>
														<Button
															onClick={() => handleAddRandomQuestions(100)}>
															100 câu
														</Button>
														<InputNumber
															min={1}
															placeholder='Số câu'
															max={100}
															step={1}
															onPressEnter={(val: any) => {
																handleAddRandomQuestions(
																	Number(val.target.value ?? 1)
																);
															}}
														/>
													</Space>
												</div>
											}
											style={{
												maxHeight: 'calc(100vh - 200px)',
												overflowY: 'auto',
											}}
											dataSource={results}
											renderItem={(item) => (
												<List.Item key={item._id}>
													<Checkbox value={item._id}>{item.question}</Checkbox>
												</List.Item>
											)}
										/>
									</Checkbox.Group>
								</div>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default AddTest;
