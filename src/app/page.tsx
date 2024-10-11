import TypeWriterTitle from "@/components/TypeWriterTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-r grainy from-rose-100 to-teal-100 min-h-screen">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-7xl font-semibold text-center">
          AI <span className="text-green-600 font-bold">note taking</span>{" "} assistant
        </h1>
        <div className="mt-4"></div>
        <h2 className="text-3xl font-semibold text-center text-slate-700">
          <TypeWriterTitle />
        </h2>
        <div className="mt-8"></div>
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-green-600">Get started
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3}/>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
