"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function HomePage() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fabricCanvas = useRef<fabric.Canvas | null>(null);

    const [address, setAddress] = useState("");
    const [roofType, setRoofType] = useState("");
    const [notes, setNotes] = useState("");
    const [loadingPDF, setLoadingPDF] = useState(false);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 600,
            height: 400,
            selection: true,
        });

        fabricCanvas.current = canvas;

        return () => {
            canvas.dispose();
            fabricCanvas.current = null;
        };
    }, []);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);

        fabric.FabricImage.fromURL(url).then((img) => {
            if (!img || !fabricCanvas.current) return;

            const canvas = fabricCanvas.current;
            canvas.clear();

            img.scaleToWidth(600);

            img.selectable = false;
            img.evented = false;

            canvas.backgroundImage = img;
            canvas.renderAll();
        });
    };

    const addCircle = () => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const circle = new fabric.Circle({
            radius: 20,
            fill: "rgba(255,0,0,0.3)",
            stroke: "red",
            strokeWidth: 2,
            left: 100,
            top: 100,
        });

        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    };

    const addArrow = () => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const line = new fabric.Line([50, 50, 150, 50], {
            stroke: "red",
            strokeWidth: 3,
        });

        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
    };

    const addText = () => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        const text = new fabric.Textbox("Label", {
            left: 180,
            top: 180,
            fill: "red",
            fontSize: 20,
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const generatePDF = async () => {
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        setLoadingPDF(true);

        const image = canvas.toDataURL({ format: "png", multiplier: 1 });

        const res = await fetch("/api/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image, address, roofType, notes }),
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        window.open(url, "_blank");
        setLoadingPDF(false);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Roof Inspection MVP</h1>

            <div className="flex flex-col space-y-2">
                <label className="font-medium text-gray-700">Upload Roof Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="p-2 border rounded w-80"
                />
            </div>

            <div className="flex gap-3">
                <button className="btn" onClick={addCircle}>Circle</button>
                <button className="btn" onClick={addArrow}>Arrow</button>
                <button className="btn" onClick={addText}>Text</button>
            </div>

            <canvas
                ref={canvasRef}
                className="border border-gray-300 rounded shadow"
            />

            <h2 className="text-xl font-semibold text-gray-800">Inspection Details</h2>

            <div className="flex flex-col space-y-3 max-w-md">
                <input
                    className="input"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <select
                    className="input"
                    value={roofType}
                    onChange={(e) => setRoofType(e.target.value)}
                >
                    <option value="">Select Roof Type</option>
                    <option value="Tile">Tile</option>
                    <option value="Metal">Metal</option>
                    <option value="Shingle">Shingle</option>
                </select>

                <textarea
                    className="input"
                    placeholder="Notes"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <button
                className="btn mt-4"
                onClick={generatePDF}
                disabled={loadingPDF}
            >
                {loadingPDF ? "Generating PDF..." : "Generate PDF"}
            </button>
        </div>
    );
}
