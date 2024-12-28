'use client';

import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Loading;
