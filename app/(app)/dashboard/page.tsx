"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Link2, Eye, ArrowRight } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const series = [
  { date: "Seg", acessos: 120 },
  { date: "Ter", acessos: 180 },
  { date: "Qua", acessos: 150 },
  { date: "Qui", acessos: 220 },
  { date: "Sex", acessos: 260 },
  { date: "Sáb", acessos: 140 },
  { date: "Dom", acessos: 90 },
];

const comunidades = [
  {
    id: "1",
    nome: "Dev Brasil",
    membros: 1520,
    linksAtivos: 18,
    capa: "/placeholder.svg?height=120&width=240",
  },
  {
    id: "2",
    nome: "Designers LATAM",
    membros: 830,
    linksAtivos: 9,
    capa: "/placeholder.svg?height=120&width=240",
  },
  {
    id: "3",
    nome: "Mkt Growth",
    membros: 410,
    linksAtivos: 6,
    capa: "/placeholder.svg?height=120&width=240",
  },
];

export default function Page() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Membros</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">2.760</div>
            <Users className="size-6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Links Ativos</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">33</div>
            <Link2 className="size-6" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acessos (7d)</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-3xl font-bold">1.160</div>
            <Eye className="size-6" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Acessos Recentes</CardTitle>
          <Badge variant="secondary">Últimos 7 dias</Badge>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              acessos: { label: "Acessos", color: "var(--chart-3)" },
            }}
            className="h-[240px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis width={32} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="acessos"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {comunidades.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <img
              src={c.capa || "/placeholder.svg"}
              alt={`Capa da comunidade ${c.nome}`}
              className="h-28 w-full object-cover"
            />
            <div className="p-4">
              <div className="font-semibold">{c.nome}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {c.membros} membros • {c.linksAtivos} links
              </div>
              <div className="mt-3">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="gap-1 bg-transparent"
                >
                  <Link href={`/community/${c.id}`}>
                    Gerenciar
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Card className="flex items-center justify-center">
          <div className="flex h-48 w-full items-center justify-center p-4">
            <Button asChild className="gap-1">
              <Link href="/community/new">
                Criar Comunidade
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
