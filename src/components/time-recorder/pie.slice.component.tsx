import React from 'react';

const PieSlice = ({ radius, startAngle, endAngle, fill }) => {
    const x1 = radius * Math.cos((Math.PI / 180) * startAngle);
    const y1 = radius * Math.sin((Math.PI / 180) * startAngle);
    const x2 = radius * Math.cos((Math.PI / 180) * endAngle);
    const y2 = radius * Math.sin((Math.PI / 180) * endAngle);
  
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  
    const pathData = `
      M 0 0
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;
  
    return (
     
        <svg width={radius * 2} height={radius * 2} viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}>
            <path style={{transition: '1s'}} d={pathData} fill={fill} />
            <circle r={radius - (radius / 7)} cx="0" cy="0" fill='#fff' />
        </svg>
      
    );
  };

  export default PieSlice;