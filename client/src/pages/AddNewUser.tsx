import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import { Form, Input, Button, message, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUser } from '../services/users'; 
import { Role, User } from '../models/User';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  phone: z.string().min(10, 'Phone is required'),
  age: z.number().min(1, 'Age must be at least 1').max(100, 'Age must be 100 or less'),
  country: z.string().min(1, 'Country is required'),
  district: z.string().min(1, 'District is required'),
  role: z.string().optional(),
});

const AddNewUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: User) => createUser(data),
    onSuccess: () => {
      message.success('User created successfully!');
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      navigate('/');
    },
    onError: () => {
      message.error('Failed to create user.');
    },
  });

  const { control, handleSubmit, formState: { errors } } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      phone: '',
      age: 18,
      country: '',
      district: '',
      role: 'user',
    },
  });

  const onSubmit = (data: User) => {
    mutation.mutate(data);
  };

  return (
    <div style={{ display: "flex", width: "100vw", minHeight: "100vh", padding: 20, alignItems: "center", justifyContent: 'center' }}>
      <Form style={{ width: "100%", maxWidth: "450px"}} layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Name"
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Surname"
          validateStatus={errors.surname ? 'error' : ''}
          help={errors.surname?.message}
        >
          <Controller
            name="surname"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input.Password {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Phone"
          validateStatus={errors.phone ? 'error' : ''}
          help={errors.phone?.message}
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Age"
          validateStatus={errors.age ? 'error' : ''}
          help={errors.age?.message}
        >
          <Controller
            name="age"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Country"
          validateStatus={errors.country ? 'error' : ''}
          help={errors.country?.message}
        >
          <Controller
            name="country"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="District"
          validateStatus={errors.district ? 'error' : ''}
          help={errors.district?.message}
        >
          <Controller
            name="district"
            control={control}
            render={({ field }) => <Input {...field} />}
          />
        </Form.Item>
        <Form.Item
          label="Role"
          validateStatus={errors.role ? 'error' : ''}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select {...field}>
                <Select.Option value={Role.USER}>User</Select.Option>
                <Select.Option value={Role.ADMIN}>Admin</Select.Option>
              </Select>
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddNewUser;
