"use client" 
import React from 'react'
import Typewriter from 'typewriter-effect'

type Props = {}

const TypeWriterTitle = (props: Props) => {
    return (
        <Typewriter
        options={{
            loop: true,
        }}
        onInit={(typewriter) => {
            typewriter.typeString('Supercharged Productivity.🚀 ')
            .pauseFor(2000)
            .deleteAll()
            .typeString('AI-Powered Insights.🤖 ')
            .pauseFor(2000)
            .deleteAll()
            .typeString('Your digital brain, supercharged.🧠⚡ ')
            .pauseFor(2000)
            .deleteAll()
            .typeString('AI-powered note-taking, simplified.💡 ')
            .pauseFor(2000)
            .deleteAll()
            .start();
        }}
        />
    )
}

export default TypeWriterTitle