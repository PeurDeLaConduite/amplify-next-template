// components/ItemSelector.jsx
import React from "react";

export default function ItemSelector({ items, selectedIds, onChange, label, idKey = "id" }) {
    const handleCheckboxChange = (itemId) => {
        if (selectedIds.includes(itemId)) {
            onChange(selectedIds.filter((id) => id !== itemId));
        } else {
            onChange([...selectedIds, itemId]);
        }
    };

    return (
        <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-3">{label}</label>
            <div className="border rounded-md max-h-60 overflow-auto p-2 bg-gray-50">
                {items.map((item) => (
                    <div
                        key={item[idKey]}
                        className={`flex items-center p-2 mb-1 rounded-md cursor-pointer ${
                            selectedIds.includes(item[idKey])
                                ? "bg-green-100 border border-green-400"
                                : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => handleCheckboxChange(item[idKey])}
                    >
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(item[idKey])}
                            onChange={() => handleCheckboxChange(item[idKey])}
                            className="mr-2 cursor-pointer"
                        />
                        <div>
                            <span className="font-medium">{item.title}</span>{" "}
                            <span className="text-sm text-gray-500">(ID: {item[idKey]})</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
