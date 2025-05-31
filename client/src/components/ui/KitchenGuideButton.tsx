import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface KitchenGuideButtonProps {
  isActive: boolean;
  onChange: (isActive: boolean) => void;
}

export const KitchenGuideButton: React.FC<KitchenGuideButtonProps> = ({ 
  isActive, 
  onChange 
}) => {
  const { language } = useLanguage();
  const [hover, setHover] = useState(false);
  
  const handleClick = () => {
    console.log("KitchenGuideButton clicked - Current active state:", isActive);
    onChange(!isActive);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: isActive 
          ? (hover ? '#16a34a' : '#22c55e') 
          : (hover ? '#ea580c' : '#f97316'),
        color: 'white',
        border: `2px solid ${isActive ? '#15803d' : '#c2410c'}`,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
      }}
    >
      <span role="img" aria-label="chef" style={{ marginRight: '8px', fontSize: '1.2rem' }}>
        👨‍🍳
      </span>
      <span>
        {language === 'en' 
          ? 'Cooking Guide' 
          : language === 'ca' 
          ? 'Guia de Cuina' 
          : 'Guía de Cocina'}
      </span>
    </button>
  );
};