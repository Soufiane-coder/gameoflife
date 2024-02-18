// AdComponent.js
import React from 'react';
import AdSense from 'react-adsense';

const GoogleAd = () => {
  return (
    <div>
      <h2>Content Above the Ad</h2>
      <AdSense.Google
        client="ca-pub-7175718056472732"
        slot="title"
        style={{ display: 'block' }}
        format="auto"
        responsive="true"
      />
      <h2>Content Below the Ad</h2>
    </div>
  );
};

export default GoogleAd;
