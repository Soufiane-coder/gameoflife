// AdComponent.js
import React, {useEffect} from 'react';
import AdSense from 'react-adsense';

const GoogleAd = () => {
  useEffect(() => {

    try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

    catch (e) {
      console.error(e)
    }

},[]);

  return (
    <div>
      <h2>Content Above the Ad</h2>
      <AdSense.Google
        client="ca-pub-7175718056472732"
        slot="1234567890"
        style={{ display: 'block' }}
        format="auto"
        responsive="true"
      />
      <h2>Content Below the Ad</h2>
    </div>
  );
};

export default GoogleAd;
