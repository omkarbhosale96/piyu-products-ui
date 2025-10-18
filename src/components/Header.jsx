import React from 'react';

const Header = () => {
  return (
    <div className="header-section">
      <div className="header-content">
        <div className="logo-container">
          <img 
            src="https://customer-assets.emergentagent.com/job_electronic-crud/artifacts/imphc2f0_WhatsApp%20Image%202025-10-15%20at%206.52.47%20PM.jpeg" 
            alt="Piyu Electronics Logo" 
            className="logo-image"
            data-testid="logo-image"
          />
        </div>
        <div className="owner-info" data-testid="owner-info">
          Owned by: Prathamesh Bhosale
        </div>
      </div>
    </div>
  );
};

export default Header;