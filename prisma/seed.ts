import { PrismaClient, ReaderAgeCategory, SampleGenre, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import {
  CANONICAL_TOOTH_TITLE,
  FICTION_TOOTH_TEXT,
  LEGACY_TOOTH_TITLE,
} from "./seedData/fictionTooth";

const db = new PrismaClient();

async function main() {
  await db.samplePiece.updateMany({
    where: { title: LEGACY_TOOTH_TITLE },
    data: { title: CANONICAL_TOOTH_TITLE },
  });

  const fictionSample = await db.samplePiece.upsert({
    where: { title: CANONICAL_TOOTH_TITLE },
    update: { genre: SampleGenre.FICTION },
    create: {
      title: CANONICAL_TOOTH_TITLE,
      genre: SampleGenre.FICTION,
      text: FICTION_TOOTH_TEXT,
    },
  });

  const essaySample = await db.samplePiece.upsert({
    where: { title: "Anonymous Sample (Personal Essay / Memoir): First Day" },
    update: { genre: SampleGenre.PERSONAL_ESSAY_MEMOIR },
    create: {
      title: "Anonymous Sample (Personal Essay / Memoir): First Day",
      genre: SampleGenre.PERSONAL_ESSAY_MEMOIR,
      text: [
        "On the first day I moved into the city, I learned how loud my thoughts could be.",
        "",
        "The apartment was smaller than the photos suggested. The shower hummed when no one touched it. My neighbor’s laughter came through the wall like a radio I couldn’t turn off.",
        "",
        "I told myself I wanted independence. I didn’t mention that I also wanted witnesses—people who might one day say, yes, you were here.",
      ].join("\n"),
    },
  });

  const poetrySample = await db.samplePiece.upsert({
    where: { title: "Anonymous Sample (Poetry): Small Weather" },
    update: { genre: SampleGenre.POETRY },
    create: {
      title: "Anonymous Sample (Poetry): Small Weather",
      genre: SampleGenre.POETRY,
      text: [
        "The mug sweats on the sill,",
        "a small storm of glass.",
        "",
        "Outside, the streetlight",
        "turns rain into threads—",
        "I keep pulling one loose",
        "and calling it tomorrow.",
      ].join("\n"),
    },
  });

  const litNonfictionSample = await db.samplePiece.upsert({
    where: { title: "Anonymous Sample (Literary Nonfiction): The Museum Label" },
    update: { genre: SampleGenre.LITERARY_NONFICTION },
    create: {
      title: "Anonymous Sample (Literary Nonfiction): The Museum Label",
      genre: SampleGenre.LITERARY_NONFICTION,
      text: [
        "In museums, the label is a small authority: a few lines that decide what you are allowed to notice.",
        "",
        "I watch people read them the way they read fortunes—quickly, as if the words might change under their gaze. We outsource meaning to the rectangle of text, then nod at the painting like it has behaved.",
      ].join("\n"),
    },
  });

  const genreFictionSample = await db.samplePiece.upsert({
    where: { title: "Anonymous Sample (Genre Fiction): The Gate" },
    update: { genre: SampleGenre.GENRE_FICTION },
    create: {
      title: "Anonymous Sample (Genre Fiction): The Gate",
      genre: SampleGenre.GENRE_FICTION,
      text: [
        "The gate only opened for stories you could prove were true.",
        "",
        "Mara brought a scar, a map, and the memory of a river that had tried to keep her.",
        "",
        "At the threshold, the metal asked, quietly: Tell it again. Don’t change a word.",
      ].join("\n"),
    },
  });

  await db.user.deleteMany({
    where: { email: { in: ["reader.a@example.com", "reader.b@example.com"] } },
  });

  const taraPassword = await hash("password123", 12);

  await db.user.upsert({
    where: { email: "tara.prakash@example.com" },
    update: {
      name: "Tara Prakash",
      role: UserRole.READER,
      passwordHash: taraPassword,
    },
    create: {
      email: "tara.prakash@example.com",
      name: "Tara Prakash",
      role: UserRole.READER,
      passwordHash: taraPassword,
      readerProfile: {
        create: {
          ageCategory: ReaderAgeCategory.ADULT,
          writingBackground: "Workshops: community fiction circle. Publications: none (yet).",
          genres: "Literary Fiction,Speculative,Flash",
          caresAbout: "Emotional clarity, scene momentum, and concrete images.",
          feedbackPhilosophy:
            "I’ll name what’s working first, then focus on 1–2 high-leverage fixes. I’m direct but not cruel.",
          feedbackSamples: {
            create: [
              {
                samplePieceId: fictionSample.id,
                genre: SampleGenre.FICTION,
                publicStrengths: "Vivid opening image; strong atmosphere; intriguing tension.",
                publicImprovements:
                  "Clarify stakes earlier; tighten a few abstractions; sharpen the knock moment.",
                publicKeyTakeaways:
                  "You’re closest when you stay concrete. Keep the uncanny grounded in sensory detail.",
                comments: {
                  create: [
                    {
                      quote: "it looked like a held breath.",
                      message:
                        "Great metaphor—sets tone fast. Consider pairing with one concrete detail (temperature, light) to anchor it.",
                    },
                    {
                      quote: "The cabin smelled like cedar and old decisions.",
                      message:
                        "Lovely line. If you can hint what the 'decision' was (even obliquely), the hook strengthens.",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  });

  await db.user.upsert({
    where: { email: "writer@example.com" },
    update: { role: UserRole.WRITER },
    create: {
      email: "writer@example.com",
      name: "Writer Demo",
      role: UserRole.WRITER,
    },
  });

  console.log("Seeded:", {
    samplePieces: {
      fiction: fictionSample.id,
      essay: essaySample.id,
      poetry: poetrySample.id,
      literaryNonfiction: litNonfictionSample.id,
      genreFiction: genreFictionSample.id,
    },
    browseReader: "tara.prakash@example.com",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
