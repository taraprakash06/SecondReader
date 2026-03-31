import { PrismaClient, ReaderAgeCategory, SampleGenre, UserRole } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const fictionSample = await db.samplePiece.upsert({
    where: { title: "Anonymous Sample (Fiction): The Tooth Fairy" },
    update: { genre: SampleGenre.FICTION },
    create: {
      title: "Anonymous Sample (Fiction): The Tooth Fairy",
      genre: SampleGenre.FICTION,
      text: `He is fifty-three years old when he loses his first tooth. Pacing the aquarium, watching clownfish flit through cloudy water, he feels something wiggling in his mouth. The man is a pediatrician. He knows pain like his own bedroom, the contours and ridges, the rough surfaces. The tooth is off-white in his palm, tinged with blood bright red. He is heading to the parking lot when a woman stops him. She’s shorter than him, but he has always been tall, has learned to understand there is always at least one foot between him and anyone else. Now, the woman holds her hand out, palm small and rivered in lines. She looks at him expectantly, head cocked, dark brown bob turning light in the sun. Her hand is still outstretched, cupped, eyes creased at the edges, smiling like someone kind. He smiles back, glances down at her hand again, slips it into his own. He is startled by the warmth, the pulse of skin, the refreshing clink of coolness from her silver wristband. He squeezes her hand, his thumb tracing the smooth skin, the knuckles and ridges and thin veins disappearing into nothing, like her hand and everything else could disintegrate at any moment. She pulls away, shaking her head, and he steps back instinctively, his face flush. “I’ve come for the tooth,” she says, and her voice is smooth, lilting, as she gestures towards her collarbone. The man sees the name tag, a small white sticker against her bare skin. “You’re the tooth fairy?” He asks and fishes within his pocket, holds the tooth out in his hand. He expects her to have a suitcase, or at least a string bag, to hold all of it, but she simply slips it into the waistband of her leggings. She leaves with a crescent moon smile and without a good-bye, and he drives home with the radio low and the windows down.

“How to pull out a tooth painlessly,” he Googles when he returns to his apartment. The Internet pulls up numerous possibilities: floss vigorously, wiggle tooth with wet gauze, apply honey onto enamel surface. He spends the weekend in his bathroom, three feet of floss slick with saliva, sheets of gauze strewn across linoleum, the sink smeared with honey, the Trader Joe’s jar emptied out. In the mirror, his reflection looks tired, dark circles and heavy wrinkles. He smiles, then bares his teeth, stares at the stubborn canines, stained yellow with age, his ‘vampire’ teeth as his ex-wife had teased.

“How to pull out a tooth, can be painful as long as it yields desired results,” he now types into the search engine. No results, so he gets creative. There was that one patient, a ten-year-old boy, spitting blood all over the waiting room chairs when he stumbled in. A baseball, the man remembers, the boy was at an Orioles game with his dad, tried to catch the ball but miscalculated the trajectory and broke his smile instead.

The elevator takes too long, so the man uses the stairs instead, one flight to the apartment unit below his. He knows Jack lives there, a college-kid he vaguely remembers. The man isn’t sure if Jack played baseball, but he remembers eyeing enviously the tanned and muscled arms breaking out of a tight T-shirt. Surely, this could work.

“I need you to throw a baseball at my face,” the man says when Jack opens the door, shirtless, barefoot, and in boxers, “My mouth, more specifically.”

“What?” Jack sets a ceramic bowl onto the foyer table. The man peers over, spots Froot Loops, colorful rings bobbing on a pool of milk. His daughter loved that cereal, the sweet aftertaste and sugary milk left in the bowl. The man pushes past Jack, beelines to the mudroom. Basketball pumps, high-tops, cleats. His hands paw through piles damp with mildew.

“Dude, you’re making a mess!” Jack shouts, and the man looks around. He hadn’t realized he’d been flinging each item across the room, the carpeted floor now strewn in red pinnies and Babolat tennis rackets and neon cones.

“I have to find it!” the man yells, kicking to the side a red Hydro Flask. It ricochets off the wall, spins under the couch. “The boy…came in…tooth out, lost tooth…baseball…where’s a baseball? Give me a baseball!”

Jack laughs nervously, holds his hands up, “Hey man, I can get you a baseball, alright, but you gotta stop wrecking my apartment, man.” He sifts through a wicker basket, pulls out a baseball, aged and tattered, “You happy, dude?”

“That will do,” the man wrings his hands together, his knuckles white, “You’ve gotta throw it at me, right at the mouth. Hard and fast. Like a professional player, okay? Like an Oriole’s player,” He opens his mouth wide, peels back his lip, steps back a few feet, “You should wind up. I think that’s what pro players do.”

Jack squirms, calloused thumb tracing the red threads of the ball, “Erm…man, I don’t know, I’ve never played baseball, like competitively--”

“Just throw it!” the man shouts, and his voice echoes against the room, makes him jump, “I’m sorry…I’m sorry, there’s this woman, I need to find her…” Jack stares at him, eyebrows scrunched, “I just wanna go back to my video game and my cereal--”

“Froot Loops,” the man says, “I saw. Please just do it!”

It didn’t hurt much in the moment. Only seconds later did he register the pain, the blood gushing from his mouth onto the plush off-white carpet. He sifts through the blood and saliva, fishes around in his mouth, fingers searching for a tooth, something white. He comes up empty, keels over to spit the blood pooling in his mouth onto the floor.

“Aw, man,” he hears Jack saying, “Is that gonna stain? Cause…like…my mom would be pissed.”`,
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

  const readerA = await db.user.upsert({
    where: { email: "reader.a@example.com" },
    update: { role: UserRole.READER },
    create: {
      email: "reader.a@example.com",
      name: "Reader A",
      role: UserRole.READER,
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
    include: { readerProfile: true },
  });

  const readerB = await db.user.upsert({
    where: { email: "reader.b@example.com" },
    update: { role: UserRole.READER },
    create: {
      email: "reader.b@example.com",
      name: "Reader B",
      role: UserRole.READER,
      readerProfile: {
        create: {
          ageCategory: ReaderAgeCategory.SENIOR,
          writingBackground: "Poetry workshops; small press chapbook.",
          genres: "Poetry,Literary Fiction",
          caresAbout: "Line music, compression, and pacing between beats.",
          feedbackPhilosophy:
            "I focus on rhythm and precision at the line level, and I’ll ask questions when intent isn’t landing.",
          feedbackSamples: {
            create: [
              {
                samplePieceId: fictionSample.id,
                genre: SampleGenre.FICTION,
                publicStrengths: "Strong cadence; crisp sensory setup; curiosity maintained.",
                publicImprovements: "Reduce generalities; make the final image more specific.",
                publicKeyTakeaways: "When you replace abstractions with specifics, the piece lifts.",
                comments: {
                  create: [
                    {
                      quote: "it looked like a held breath.",
                      message:
                        "The rhythm works. If you swap 'looked' for a stronger verb, the line gains pressure.",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
    include: { readerProfile: true },
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
    readerA: readerA.id,
    readerB: readerB.id,
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

