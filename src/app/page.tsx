import { CreateCharacterForm } from "@/app/CreateCharacterForm";

export default function Home() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex flex-col gap-2 rounded-lg bg-gray-200 p-4 dark:bg-gray-800">
                <h1 className="text-xl font-bold">Create a new character</h1>

                <CreateCharacterForm />
            </div>
        </div>
    );
}
