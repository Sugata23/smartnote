// /api/createNoteBook

import { generateImagePrompt } from "@/lib/openAI";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = auth();
    if(!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    const image_description = await generateImagePrompt(name);
    console.log({image_description});
    return new NextResponse("ok");

}