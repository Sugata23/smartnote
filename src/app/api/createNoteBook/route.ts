// /api/createNoteBook

import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { generateImagePrompt } from "@/lib/openAI";
import { generateImage } from "@/lib/openAI";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { name } = await req.json();
        if (!name) return new NextResponse("Name is required", { status: 400 });

        // Generate the image description
        const image_description = await generateImagePrompt(name);
        
        // Generate the actual image
        const image_url = await generateImage(image_description);
        
        // Save to database
        const note_ids = await db.insert($notes).values({
            name,
            userId,
            imageUrl: image_url,
        }).returning({ insertedId: $notes.id });

        return NextResponse.json({ note_id: note_ids[0].insertedId });

    } catch (error) {
        console.error("Error creating notebook:", error);
        return new NextResponse(
            error instanceof Error ? error.message : "Internal Server Error",
            { status: 500 }
        );
    }
}
