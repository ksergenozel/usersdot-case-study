import { useState } from 'react';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { Table, Input, Modal, message, Button } from 'antd';
import { deleteUser, fetchUsers } from '../services/users';
import { User } from '../models/User';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import useDebounce from '../hooks/useDebounce';

const UserList = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data, error, isLoading } = useQuery({
    queryKey: ['users', debouncedSearch, page, pageSize],
    queryFn: fetchUsers,
  });

  const handleDelete = async (userId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success('User deleted successfully!');
          queryClient.invalidateQueries(['users'] as InvalidateQueryFilters);
        } catch (error) {
          message.error('Failed to delete user.');
        }
      },
    });
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_text: any, _record: any, index: number) =>
        (page - 1) * pageSize + index + 1,
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Surname', dataIndex: 'surname', key: 'surname' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: any, record: User) => (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
          <Link to={`/users/${record.id}`}>
            <EditTwoTone style={{ fontSize: 20, padding: 6 }} />
          </Link>
          <DeleteTwoTone
            onClick={() => handleDelete(record.id)}
            style={{ fontSize: 20, padding: 6 }}
            twoToneColor="red"
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Input.Search
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/add-new-user">
          <Button type="primary">Add New User</Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={data?.users}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: pageSize,
          total: data?.totalCount,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
        loading={isLoading}
      />
      {error && <p style={{ color: 'red' }}>Failed to load users.</p>}
    </div>
  );
};

export default UserList;
