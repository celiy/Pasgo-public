
import { Separator } from "../ui/separator";

export default function FormatItemDisplay(items) {
    if (!Array.isArray(items) || items.length === 0) return null;

    let nonEmptyFields = [];
    let arrIndex = 0;

    for (const obj of items) {
        let hasItems = false;

        for (const [key, value] of Object.entries(obj)) {
            if (value) {
                hasItems = true;
            }
        }

        if (hasItems) {
            nonEmptyFields.push(arrIndex);
        }

        arrIndex++;
    }

    const formatValue = (value) => {
        if (!value) {
            value = "";
        }
        
        return value?.replace("_BIG_", "")?.trim();
    }

    const formatClasses = (value) => {
        if (!value) {
            value = "";
        }

        if (value.length > 0) {
            return value.split(" ")?.find((val) => val === "_BIG_") ? "text-lg" : "";
        }
        
        return "";
    }

    return (
        <>
            {items.map((obj, idx) => (
                <div key={idx}>
                    {Object.entries(obj).map(([key, value]) =>
                        value ? (
                            <div 
                                className={formatClasses(key)}
                                key={key}
                            >
                                <b>{formatValue(key)}:</b> {value}
                            </div>
                        ) : null
                    )}

                    {idx < items.length - 1 && nonEmptyFields.includes(idx) && <Separator className="my-2" />}
                </div>
            ))}
        </>
    );
}