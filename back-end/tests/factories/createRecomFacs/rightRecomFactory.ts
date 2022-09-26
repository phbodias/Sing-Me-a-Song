import { faker } from "@faker-js/faker";

export async function recommendationFac() {
  return {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
  };
}

export async function recommendationFacWithScore() {
  return {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    score: faker.datatype.number({ min: -5, max: 100 }),
  };
}
