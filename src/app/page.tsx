import { LoadCharacterList } from "@/app/LoadCharacterList";
import { NewCharacterForm } from "@/app/NewCharacterForm";
import { Divider } from "@/components/Divider";

export default function Home() {
    return (
        <div className="flex h-screen items-center justify-center">
            <main className="flex flex-col gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4 md:flex-row">
                <NewCharacterForm />

                <Divider orientation="horizontal" className="flex md:hidden">
                    OR
                </Divider>
                <Divider orientation="vertical" className="hidden md:flex">
                    OR
                </Divider>

                <LoadCharacterList />
            </main>
        </div>
    );
}
