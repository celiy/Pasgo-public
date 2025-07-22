import { TrendingDown, TrendingUp } from "lucide-react"
import moment from "moment"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
}

moment.locale('pt-BR');

const translateDate = {
    "January": "Janeiro",
    "February": "Fevereiro",
    "March": "Março",
    "April": "Abril",
    "May": "Maio",
    "June": "Junho",
    "July": "Julho",
    "August": "Agosto",
    "September": "Setembro",
    "October": "Outubro",
    "November": "Novembro",
    "December": "Dezembro",
}

export function CurveChart(props) {
    let chartData = [];
    if (props.chartData && props.chartData.length) {
        chartData = props.chartData;
    } 

    return (
        <Card>
            <CardHeader>
                <CardTitle>Volume de vendas</CardTitle>
                <CardDescription>
                    Mostrando o número de vendas feitas nos últimos 3 meses
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Area
                            dataKey="vendas"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex items-start w-full gap-2 text-sm">
                    <div className="grid gap-2">
                        {chartData.length > 1 && isFinite(chartData[chartData.length - 1].vendas - chartData[chartData.length - 2].vendas) && (chartData[chartData.length - 1].vendas - chartData[chartData.length - 2].vendas) !== 0 && <>
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Inclinando {chartData[chartData.length - 1].vendas > chartData[chartData.length - 2].vendas ? "positivamente" : "negativamente"} por {(((chartData[chartData.length - 1].vendas - chartData[chartData.length - 2].vendas) / chartData[chartData.length - 2].vendas) * 100).toFixed(2)}% este mês {chartData[chartData.length - 1].vendas > chartData[chartData.length - 2].vendas ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />} 
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {chartData[chartData.length - 1].month}
                        </div>
                        </>}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}