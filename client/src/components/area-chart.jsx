"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
// const chartData = [
//     { date: "2024-04-01", desktop: 222 },
//     { date: "2024-04-02", desktop: 97 },
//     { date: "2024-04-03", desktop: 167 },
//     { date: "2024-04-04", desktop: 242 },
//     { date: "2024-04-05", desktop: 373 },
// ]

const chartConfig = {
    desktop: {
        label: "Vendido",
        color: "hsl(var(--chart-1))",
    },
}

export function HorizontalAreaChart(props) {
    const [ timeRange, setTimeRange ] = React.useState("90d");
    const [ type, setType ] = React.useState("3m");
    const [ data, setData ] = React.useState([]);

    React.useEffect(() => {
        const filteredData = props.data.filter((item) => {
            const date = new Date(item.date);
            const now = new Date();
            if (type === "3m") return date > new Date(now.setMonth(now.getMonth() - 3));
            else if (type === "1m") return date > new Date(now.setMonth(now.getMonth() - 1));
            else if (type === "7d") return date > new Date(now.setDate(now.getDate() - 7));
        });

        setData(filteredData);
    }, [props.data, type])

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
                <div className="grid w-full grid-cols-1 gap-1 text-center sm:grid-cols-2 sm:text-left">
                    <div>
                        <CardTitle>Total em R$</CardTitle>
                        <CardDescription>
                            Mostrando o total de vendas <b>do caixa</b> 
                                {type === "3m" && " nos últimos 3 meses"}
                                {type === "1m" && " deste mês"}
                                {type === "7d" && " nos últimos 7 dias"}
                        </CardDescription>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full place-self-end sm:w-fit">
                                {type === "3m" && "Últimos 3 meses"}
                                {type === "1m" && "Este mês"}
                                {type === "7d" && "Últimos 7 dias"}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-[16rem]" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setType("3m")}>
                                    Últimos 3 meses
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setType("1m")}>
                                    Este mês
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setType("7d")}>
                                    Últimos 7 dias
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("pt-BR", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("pt-BR", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="url(#fillMobile)"
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
