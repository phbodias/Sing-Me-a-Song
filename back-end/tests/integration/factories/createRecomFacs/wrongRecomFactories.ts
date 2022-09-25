import { faker } from "@faker-js/faker";

export async function wrongNameRecomFac() {
  return {
    name: "",
    youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
  };
}

export async function wrongDomainRecomFac() {
  const domain = await wrongDomain();

  return {
    name: faker.music.songName(),
    youtubeLink:
      "https://www." + domain + ".com/" + faker.word.adjective(10),
  };
}

export async function allWrongRecomFac() {
  const domain = await wrongDomain();

  return {
    name: faker.random.numeric(),
    youtubeLink:
      "https://www." + domain + ".com/" + faker.word.adjective(10),
  };
}

async function wrongDomain() {
  let domain = faker.internet.domainWord();
  while (domain === "youtube" || domain === "youtu")
    domain = faker.internet.domainWord();

  return domain;
}
