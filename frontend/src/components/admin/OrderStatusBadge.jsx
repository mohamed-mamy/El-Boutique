import React from 'react';

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending'
  },
  confirmed: {
    color: 'bg-blue-100 text-blue-800',
    label: 'Confirmed'
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    label: 'Completed'
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    label: 'Cancelled'
  }
};

const OrderStatusBadge = ({ status }) => {
  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
