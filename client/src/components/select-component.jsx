import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useState } from 'react';

export default function SelectComponent(props) {
    const [selectedValue, setSelectedValue] = useState('');
    const { itens, onChange } = props;
    const handleChange = (value) => {
        setSelectedValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <>
            <Select onValueChange={handleChange}>
                <SelectTrigger>
                    <SelectValue placeholder={props.placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {Array.isArray(itens) ? (
                        itens.map((item, index) =>
                            <SelectItem value={item.value} key={index}>{item.name}</SelectItem>
                        )) : (<> </>)}
                </SelectContent>
            </Select>
        </>
    )
}