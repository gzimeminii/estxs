"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronRight, Copy, Edit, MoreHorizontal, Plus, Trash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EstimateItem {
  id: string
  chapterId: string
  postNumber: string
  description: string
  subDescription?: string[]
  quantity: number
  unit: string
  unitPrice: number
  isChapter?: boolean
  subRows?: EstimateItem[]
}

const initialData: EstimateItem[] = [
  {
    id: "ch1",
    chapterId: "1",
    postNumber: "01",
    description: "KAPITTEL 1",
    quantity: 0,
    unit: "",
    unitPrice: 0,
    isChapter: true,
    subRows: [
      {
        id: "1-101",
        chapterId: "1",
        postNumber: "101",
        description: "Rigg og drift",
        subDescription: [
          "Inkluderer avfallshåndtering, transport fra leverandører og generell rigg og drift av prosjektet",
          "Frakobling av elektrisk og vvs. Provisorisk strøm og vann i byggeperioden",
        ],
        quantity: 1,
        unit: "stk",
        unitPrice: 60000,
      },
      {
        id: "1-102",
        chapterId: "1",
        postNumber: "102",
        description: "Rivearbeider",
        subDescription: [
          "Riving av lettvegger, bad og kjøkken inventar og pigging av påstøp og fliser på badet",
          "Hjelpe arbeider for elektriker og rørlegger på bad (pigging/klargjøring)",
        ],
        quantity: 1,
        unit: "RS",
        unitPrice: 40000,
      },
      {
        id: "1-103",
        chapterId: "1",
        postNumber: "103",
        description: "Bortkjøring av avfall",
        subDescription: ["Vi bruker iSekk og vi etter fakturerer etter endelig produsert avfall"],
        quantity: 1,
        unit: "RS",
        unitPrice: 25000,
      },
    ],
  },
  {
    id: "ch2",
    chapterId: "2",
    postNumber: "02",
    description: "KAPITTEL 2",
    quantity: 0,
    unit: "",
    unitPrice: 0,
    isChapter: true,
    subRows: [
      {
        id: "2-201",
        chapterId: "2",
        postNumber: "201",
        description: "Påføring av vegg for avløp ved forlenging av avløp (kjøkken)",
        subDescription: [
          "Montering 70mm trestender, uisolert, gipsplater og eventuelt nødvendig spikerslag for kjøkken",
        ],
        quantity: 13,
        unit: "m²",
        unitPrice: 920,
      },
      {
        id: "2-202",
        chapterId: "2",
        postNumber: "202",
        description: "Påføring av vegg (kontoret)",
        subDescription: ["Montering 50mm trestender, uisolert, gipsplater og eventuelt nødvendig spikerslag"],
        quantity: 5,
        unit: "m²",
        unitPrice: 920,
      },
      {
        id: "2-203",
        chapterId: "2",
        postNumber: "203",
        description: "Påføring av vegg i gangen for å få inn skyvedørskasetter",
        subDescription: [
          "Montering 98mm trestender, uisolert, gipsplater og eventuelt nødvendig spikerslag for kjøkken",
        ],
        quantity: 14,
        unit: "m²",
        unitPrice: 920,
      },
      {
        id: "2-204",
        chapterId: "2",
        postNumber: "204",
        description: "Treramme rundt lysåpningen for garderobeskap/kott",
        subDescription: ["Rette hjørner og eventuelt skjært ned fra himling"],
        quantity: 1,
        unit: "RS",
        unitPrice: 4500,
      },
    ],
  },
]

export default function EstimateForm() {
  const [data, setData] = React.useState(() => {
    const savedData = localStorage.getItem("estimateData")
    return savedData ? JSON.parse(savedData) : initialData
  })
  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  React.useEffect(() => {
    localStorage.setItem("estimateData", JSON.stringify(data))
  }, [data])

  const updateItem = React.useCallback((itemId: string, field: string, value: any) => {
    setData((prevData) => {
      return prevData.map((chapter) => {
        if (chapter.id === itemId) {
          return { ...chapter, [field]: value }
        }
        if (chapter.subRows) {
          return {
            ...chapter,
            subRows: chapter.subRows.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)),
          }
        }
        return chapter
      })
    })
  }, [])

  const updateSubDescription = React.useCallback((itemId: string, index: number, value: string) => {
    setData((prevData) => {
      return prevData.map((chapter) => {
        if (chapter.subRows) {
          return {
            ...chapter,
            subRows: chapter.subRows.map((item) => {
              if (item.id === itemId && item.subDescription) {
                const newSubDescription = [...item.subDescription]
                newSubDescription[index] = value
                return { ...item, subDescription: newSubDescription }
              }
              return item
            }),
          }
        }
        return chapter
      })
    })
  }, [])

  const addSubDescription = (itemId: string) => {
    setData((prevData) => {
      const newData = [...prevData]
      for (const chapter of newData) {
        if (chapter.subRows) {
          for (const item of chapter.subRows) {
            if (item.id === itemId) {
              if (!item.subDescription) {
                item.subDescription = []
              }
              item.subDescription.push("")
              return newData
            }
          }
        }
      }
      return newData
    })
  }

  const removeSubDescription = (itemId: string, index: number) => {
    setData((prevData) => {
      const newData = [...prevData]
      for (const chapter of newData) {
        if (chapter.subRows) {
          for (const item of chapter.subRows) {
            if (item.id === itemId && item.subDescription) {
              item.subDescription.splice(index, 1)
              return newData
            }
          }
        }
      }
      return newData
    })
  }

  const duplicateItem = (itemId: string) => {
    setData((prevData) => {
      return prevData.map((chapter) => {
        if (chapter.subRows) {
          const itemIndex = chapter.subRows.findIndex((item) => item.id === itemId)
          if (itemIndex !== -1) {
            const item = chapter.subRows[itemIndex]
            const newItem = {
              ...item,
              id: `${item.id}-copy-${Date.now()}`,
              description: `${item.description} (Kopi)`,
            }
            chapter.subRows.splice(itemIndex + 1, 0, newItem)
          }
        }
        return chapter
      })
    })
  }

  const deleteItem = (itemId: string) => {
    setData((prevData) => {
      return prevData.map((chapter) => {
        if (chapter.subRows) {
          chapter.subRows = chapter.subRows.filter((item) => item.id !== itemId)
        }
        return chapter
      })
    })
  }

  const columns: ColumnDef<EstimateItem>[] = [
    {
      accessorKey: "postNumber",
      header: "Post",
      cell: ({ row }) => {
        if (row.original.isChapter) {
          return (
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => row.toggleExpanded()}
                className="-ml-3 h-6 w-6 p-0 hover:bg-transparent"
              >
                {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
              <Input
                value={row.original.postNumber}
                onChange={(e) => updateItem(row.original.id, "postNumber", e.target.value)}
                className="w-16 h-8 bg-transparent border-none focus:ring-0"
              />
            </div>
          )
        }
        return (
          <Input
            value={row.original.postNumber}
            onChange={(e) => updateItem(row.original.id, "postNumber", e.target.value)}
            className="w-16 h-8 bg-transparent border-none focus:ring-0"
          />
        )
      },
    },
    {
      accessorKey: "description",
      header: "Beskrivelse",
      cell: ({ row }) => (
        <div className="space-y-2">
          <Input
            value={row.original.description}
            onChange={(e) => updateItem(row.original.id, "description", e.target.value)}
            className={`w-full h-8 bg-transparent border-none focus:ring-0 ${
              row.original.isChapter ? "font-medium" : ""
            }`}
          />
          {!row.original.isChapter && (
            <div className="space-y-2">
              {row.original.subDescription?.map((desc, index) => (
                <div key={index} className="flex items-center gap-2 pl-4">
                  <span className="text-sm text-muted-foreground">-</span>
                  <Input
                    value={desc}
                    onChange={(e) => updateSubDescription(row.original.id, index, e.target.value)}
                    className="flex-1 h-7 text-sm bg-transparent border-none focus:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubDescription(row.original.id, index)}
                    className="h-7 w-7 p-0 hover:bg-transparent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => addSubDescription(row.original.id)} className="ml-4 h-7">
                <Plus className="h-4 w-4 mr-2" />
                Legg til beskrivelse
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Mengde</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {!row.original.isChapter && (
            <Input
              type="number"
              value={row.original.quantity}
              onChange={(e) => updateItem(row.original.id, "quantity", Number(e.target.value))}
              className="w-20 h-8 text-right ml-auto bg-transparent border-none focus:ring-0"
            />
          )}
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: "Enh.",
      cell: ({ row }) =>
        !row.original.isChapter && (
          <Select value={row.original.unit} onValueChange={(value) => updateItem(row.original.id, "unit", value)}>
            <SelectTrigger className="w-20 h-8 bg-transparent border-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m²">m²</SelectItem>
              <SelectItem value="RS">RS</SelectItem>
              <SelectItem value="stk">stk</SelectItem>
            </SelectContent>
          </Select>
        ),
    },
    {
      accessorKey: "unitPrice",
      header: () => <div className="text-right">Enh. Pris</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {!row.original.isChapter && (
            <Input
              type="number"
              value={row.original.unitPrice}
              onChange={(e) => updateItem(row.original.id, "unitPrice", Number(e.target.value))}
              className="w-28 h-8 text-right ml-auto bg-transparent border-none focus:ring-0"
            />
          )}
        </div>
      ),
    },
    {
      id: "sumExVat",
      header: () => <div className="text-right">Sum u/mva</div>,
      cell: ({ row }) => {
        const sum = row.original.isChapter
          ? row.original.subRows?.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0) || 0
          : row.original.quantity * row.original.unitPrice
        return <div className="text-right">{sum.toLocaleString("no-NO")},-</div>
      },
    },
    {
      id: "sumIncVat",
      header: () => <div className="text-right">Sum m/mva</div>,
      cell: ({ row }) => {
        const sum = row.original.isChapter
          ? row.original.subRows?.reduce((acc, item) => acc + item.quantity * item.unitPrice * 1.25, 0) || 0
          : row.original.quantity * row.original.unitPrice * 1.25
        return <div className="text-right">{sum.toLocaleString("no-NO")},-</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        if (!row.original.isChapter) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Åpne meny</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => duplicateItem(row.original.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Dupliser
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Rediger
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => deleteItem(row.original.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Slett
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  const totalExVat = data.reduce((acc, chapter) => {
    return acc + (chapter.subRows?.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0) || 0)
  }, 0)

  const vat = totalExVat * 0.25
  const totalIncVat = totalExVat + vat

  return (
    <div className="w-full space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {table.getFlatHeaders().map((header) => (
                <TableHead
                  key={header.id}
                  className={
                    header.column.id === "sumExVat" ||
                    header.column.id === "sumIncVat" ||
                    header.column.id === "unitPrice" ||
                    header.column.id === "quantity"
                      ? "text-right"
                      : ""
                  }
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.original.isChapter ? "bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "sumExVat" ||
                        cell.column.id === "sumIncVat" ||
                        cell.column.id === "unitPrice" ||
                        cell.column.id === "quantity"
                          ? "text-right"
                          : ""
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Ingen poster
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-medium">
                SUM EKSL. MVA:
              </TableCell>
              <TableCell className="text-right font-medium">{totalExVat.toLocaleString("no-NO")},-</TableCell>
              <TableCell />
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-medium">
                SUM MVA:
              </TableCell>
              <TableCell className="text-right font-medium">{vat.toLocaleString("no-NO")},-</TableCell>
              <TableCell />
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={5} className="text-right font-medium">
                SUM INKL. MVA:
              </TableCell>
              <TableCell className="text-right font-medium">{totalIncVat.toLocaleString("no-NO")},-</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

