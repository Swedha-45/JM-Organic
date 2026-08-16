// src/components/admin/AdminPageHeader.jsx
import React from 'react';

const AdminPageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="border-b border-gray-200 bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  );
};

export default AdminPageHeader;