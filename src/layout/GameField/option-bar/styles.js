import chroma from 'chroma-js';
const optionColor = chroma('#00602d')

export const customStyles = {
  container: (provided, state) => ({
      ...provided,
      // display: 'inline-block',
  }),
  control: (provided, state) => ({
      ...provided,
      // width: "30rem",
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