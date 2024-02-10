export const addCoinToUser = (user) => {
  user.coins = +user.coins + 1;
  return { ...user };
};
