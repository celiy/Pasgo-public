import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

export function ComponentPieChart(props) {
    const [totalVisitors, setTotalVisitors] = React.useState(0);

    const chartConfig = props.PchartConfig;
    const chartData = props.PchartData;

    React.useEffect(() => {
        setTotalVisitors(chartData.reduce((acc, curr) => acc + curr.itens, 0));
    }, [chartData]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    {props.title || "Produtos mais vendidos"}
                </CardTitle>

                <CardDescription>
                    {new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date())}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        
                        <Pie
                            data={chartData}
                            dataKey="itens"
                            nameKey="id"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="text-3xl font-bold fill-foreground"
                                                >
                                                    {totalVisitors}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Itens
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className="flex-col gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Passe o mouse em cima para ver o total de cada item
                </div>
            </CardFooter>
        </Card>
    )
}
