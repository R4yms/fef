module.exports = async (client) => {
  console.log(`Logged In As Lrs Music`);
  await client.user.setActivity(`.help - http://lrsmusic.cf/ #START`, {
    type: "LISTENING",   //LISTENING, WATCHING, PLAYING, STREAMING
  });
};