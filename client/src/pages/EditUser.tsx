import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, InvalidateQueryFilters } from '@tanstack/react-query';
import { Form, Input, Button, message, Select } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { fetchUser, updateUser } from '../services/users';
import { Role, User } from '../models/User';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  surname: z.string().min(1, 'Surname is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().optional(),
  phone: z.string().min(10, 'Phone is required'),
  age: z.number().min(1, 'Age must be at least 1').max(100, 'Age must be 100 or less'),
  country: z.string().min(1, 'Country is required'),
  district: z.string().min(1, 'District is required'),
  role: z.string().optional(),
});

const EditUser = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  if (!id || isNaN(Number(id))) {
    navigate('/');
  }

  const queryClient = useQueryClient();

  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => fetchUser(Number(id)),
  });

  const mutation = useMutation({
    mutationFn: (data: User) => updateUser(Number(id), data),
    onSuccess: () => {
      message.success('User updated successfully!');
      queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
      navigate('/');
    },
    onError: () => {
      message.error('Failed to update user.');
    },
  });

  const { control, handleSubmit, reset, formState: { errors } } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user, reset]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load user data.</p>;

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
            render={({ field }) => <Input.Password {...field} placeholder='Enter new password' />}
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

export default EditUser;
