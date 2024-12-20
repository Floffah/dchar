import { CreateCharacterForm } from "@/app/CreateCharacterForm";
import { LoadCharacterSheet } from "@/app/LoadCharacterSheet";
import { Divider } from "@/components/Divider";

export default function Home() {
    return (
        <div className="flex h-screen items-center justify-center p-4">
            <main className="relative flex flex-col gap-4 rounded-lg bg-gray-200 p-4 md:flex-row dark:bg-gray-800">
                <CreateCharacterForm />

                <Divider orientation="vertical" className="hidden md:flex">
                    OR
                </Divider>
                <Divider orientation="horizontal" className="flex md:hidden">
                    OR
                </Divider>

                <LoadCharacterSheet />
            </main>
        </div>
    );
}
