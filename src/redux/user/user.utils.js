export const addCoinToUser = (user) => {
  user.coin = +user.coin + 1;
  user.xp = +user.xp + 1;
  return { ...user };
};
