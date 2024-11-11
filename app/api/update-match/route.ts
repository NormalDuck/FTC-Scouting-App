/* eslint-disable @cspell/spellchecker */
import { MongoClient, ServerApiVersion } from "mongodb";

import { Match } from "@/types/team-properties";
import { validateMatch } from "@/utils/validators";

export async function POST(request: Request) {
  try {
    const uri = `mongodb+srv://xbot:${process.env.MONGO_DB_PASSWORD}@scoutingapp-intothedeep.s6jr6.mongodb.net/?retryWrites=true&w=majority&appName=ScoutingApp-IntoTheDeep`;
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    const json = (await request.json()) as Match;
    console.log(json);

    validateMatch.parse(json);

    const search = await client
      .db("MatchData")
      .collection("Matches")
      .findOne({ match: json.match });
    if (search === null)
      return Response.json("cannot replace something that doesn't exit");
    await client
      .db("MatchData")
      .collection("Matches")
      .replaceOne(
        { match: json.match },
        {
          ...search,
          ...json,
        },
      );
    return Response.json("ok");
  } catch {
    console.log("failed");
    return Response.json("failed");
  }
}

export async function GET() {
  return Response.json("use POST request please");
}
