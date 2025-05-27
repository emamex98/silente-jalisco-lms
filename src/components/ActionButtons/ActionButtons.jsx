import React from 'react';
import { Button, Flex } from 'antd';

const ActionButtons = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Flex gap={10}>
      {items.map((item) => (
        <Button
          key={item.key}
          icon={item.icon}
          onClick={item.onClick}
          type={item.type}
          danger={item.danger}
          disabled={item.disabled}
        >
          {item.text}
        </Button>
      ))}
    </Flex>
  );
};

export default ActionButtons;
