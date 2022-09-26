import { faker } from "@faker-js/faker";

export async function fakeRecommendationFac() {
  return {
    id: 0,
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    score: faker.datatype.number({ min: -5, max: 100 }),
  };
}

export async function manyFakeRecomFac() {
  const recoms = [];
  for (let i = 0; i < 10; i++) {
    const recom = await fakeRecommendationFac();
    recom.id = i;
    recoms.push(recom);
  }
  return recoms;
}
