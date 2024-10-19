// /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImagePrompt } from "@/lib/openAI";
import { generateImage } from "@/lib/openAI";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    try {
        const image_description = await generateImagePrompt(name);
        //console.log({ image_description });
        if (!image_description) {
            return new NextResponse("failed to generate image description", {
                status: 500,
            });
        }
        const image_url = await generateImage(image_description);
        if (!image_url) {
            return new NextResponse("failed to generate image", {
                status: 500,
            });
        }
        const note_ids = await db
            .insert($notes)
            .values({
                name,
                userId,
                imageUrl: image_url,
            })
            .returning({
                insertedId: $notes.id,
            });

        return NextResponse.json({
            note_id: note_ids[0].insertedId,
        });

    } catch (error) {
        if (error instanceof Error && error.message.includes("quota")) {
            return new NextResponse(error.message, { status: 402 });
        }
        console.error("Error creating notebook:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
