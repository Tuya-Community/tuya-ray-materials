import React, { useEffect, useState } from 'react';
import { Text } from '@ray-js/components';

const COLORS = ['#1677ff', '#b3d4fc', '#b3d4fc']; // 蓝色+浅蓝

const DotsLoading: React.FC = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % 3);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <Text style={{ display: 'inline-flex', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <Text
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: i === active ? (COLORS?.[0] || '#1677ff') : (COLORS?.[1] || '#b3d4fc'),
            margin: '0 2px',
            display: 'inline-block',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </Text>
  );
};

export default DotsLoading;
