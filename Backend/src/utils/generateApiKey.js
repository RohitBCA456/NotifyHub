export const generateApiKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let apiKey = "";
  for (let i = 0; i < 32; i++) {
    apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return apiKey;
};
