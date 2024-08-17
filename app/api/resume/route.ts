import {resumeDatabase} from "@/app/api/storage";
import {NextResponse} from "next/server";
import {access, writeFile} from "node:fs/promises";
import path, { join } from "node:path";
import {pdfToString} from "@/app/api/utils";

const dirPath = path.join(process.cwd(), "/temp/resume");

export async function POST(req: Request) {
    const  formData = await req.formData();

    const file = formData.get("file") as File | null;
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename =  file.name.replaceAll(" ", "_");

    try {
        await access(dirPath);
        console.log(`Directory ${dirPath} exists.`);
    } catch (err) {
        console.log(`Directory ${dirPath} does not exist.`);
    }

    try {
        const filePath = join(dirPath, filename);
        await writeFile(filePath, buffer);

        resumeDatabase.value = await pdfToString(filePath)
        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}
