module.exports = {
    RandomBetween : function between(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
    }
};
  
