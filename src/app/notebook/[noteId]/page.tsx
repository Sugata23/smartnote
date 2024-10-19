import { db } from '@/lib/db';
import { $notes } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { eq, and } from 'drizzle-orm';

type Props = {
    params: {
        noteId: string;
    }
}

const NoteBookPage = async ({ params: { noteId } }: Props) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/dashboard");
    }
    const notes = await db
    .select()
    .from($notes)
    .where(and(eq($notes.id, parseInt(noteId)), eq($notes.userId, userId)));
    if (notes.length != 1) {
        return redirect("/dashboard");
    }
    const note = notes[0];
    return <div>{noteId}</div>
}

export default NoteBookPage
