import { faker } from "@faker-js/faker";

export default async function recommendationFac() {
  return {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
  };
}
