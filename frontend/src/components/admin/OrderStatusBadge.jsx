import React from 'react';
import { useTranslation } from 'react-i18next';

const OrderStatusBadge = ({ status }) => {
  const { t } = useTranslation();

  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      label: t('admin.pending')
    },
    confirmed: {
      color: 'bg-blue-100 text-blue-800',
      label: t('admin.confirmed')
    },
    completed: {
      color: 'bg-green-100 text-green-800',
      label: t('admin.completed')
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      label: t('admin.cancelled')
    }
  };

  const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
