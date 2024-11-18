import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch("https://doanchuyennganhweb.onrender.com/create-payment-url", {
            // Thay URL này bằng URL backend của bạn
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, message: "Cannot connect to backend" },
            { status: 500 }
        );
    }
}
