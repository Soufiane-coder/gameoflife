const isTimeInInterval = (timeToCheck, startTime, endTime) => {
    const time = new Date(`1970-01-01T${timeToCheck}:00`); // Create a Date object with the specified time (ignoring the date part)

    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    return time > start && time < end;
}

export const isTimeInArray = (array, timeToCheck) => {
    return array.some(item => isTimeInInterval(timeToCheck, item.startRoutine, item.endRoutine));
}


export const customStyles = {
    container: (provided, state) => ({
        ...provided,
        display: 'inline-block',
        zIndex: '99999'
    }),
    control: (provided, state) => ({
        ...provided,
        width: "26rem",
        // "&:active" : {
        //   ...provided[':active'],
        //   boxShadow: '0 0 0 1.5px ' + optionColor.css() ,
        //   border:"2px solid " + optionColor.css()
        // },
        // "&:focus": {
        //   ...provided[':focus'],
        //   boxShadow: '0 0 0 1.5px ' + optionColor.css() ,
        //   border:"2px solid " + optionColor.css()
        // }
      }),
    option: (provided, {isSelected, isDisabled}) => ({
      ...provided,
      backgroundColor: isSelected ? optionColor.css() : "white",
      "&:hover": {
        backgroundColor: isSelected ? optionColor.css() : optionColor.alpha(0.1).css(),
        color:  isSelected ? 'white' : "black",
      },
      "&:active" : {
        ...provided[':active'],
        backgroundColor: !isDisabled
        ? isSelected
          ? "#00602d"
          : optionColor.alpha(0.3).css()
        : undefined,
      
      },
  
    }),
  };