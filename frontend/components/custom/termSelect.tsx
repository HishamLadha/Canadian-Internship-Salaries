"use client"

import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TermSelectProps {
    terms: string[]
    onValueChange?: (value: string) => void
    defaultValue?: string
}

export function TermSelect({ terms, onValueChange, defaultValue }: TermSelectProps) {
    return (
        <Select onValueChange={onValueChange} defaultValue={defaultValue}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select work term" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {terms.map((term) => (
                        <SelectItem key={term} value={term}>
                            {`${term}`}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}