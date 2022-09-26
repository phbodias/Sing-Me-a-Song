import { faker } from "@faker-js/faker";
import { prisma } from "../src/database";

async function main() {
  await prisma.recommendation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=0mcx6dmtYvM",
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=k3WkJq478To",
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/watch?v=kCUwIi7qd2M",
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 6 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    },
  });
  await prisma.recommendation.upsert({
    where: { id: 7 },
    update: {},
    create: {
      name: faker.music.songName(),
      youtubeLink: "https://www.youtube.com/" + faker.word.adjective(10),
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
