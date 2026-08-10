import { useState, useMemo } from "react";
import {
  useTable,
  TableStatus,
  TableStatusLabel,
  TableAreaLabel,
  type TableResponse,
} from "@repo/shared-features/tables";
import { AppLayout } from "@/components/layouts";
import { TableGrid } from "@/features/tables";
import { Icon } from "@repo/ui";

export function TablePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [selectedTable, setSelectedTable] = useState<TableResponse | null>(
    null,
  );

  // Gọi hook API truyền params theo đúng DTO TableFilterParams
  const {
    data: tablesData,
    isLoading,
    isError,
    refetch,
  } = useTable({
    search: searchQuery || undefined,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    area: selectedArea === "ALL" ? undefined : selectedArea,
    size: 100,
  });

  // Bóc tách dữ liệu danh sách bàn từ API response
  const tables: TableResponse[] = useMemo(() => {
    if (Array.isArray(tablesData)) return tablesData;
    return tablesData?.data ?? [];
  }, [tablesData]);

  // Bộ lọc Client-side khớp hoàn toàn với kiểu TableResponse (table.area: TableArea)
  const filteredTables = useMemo(() => {
    return tables.filter((table: TableResponse) => {
      const matchStatus =
        selectedStatus === "ALL" || table.status === selectedStatus;

      const matchArea = selectedArea === "ALL" || table.area === selectedArea;

      const matchSearch =
        !searchQuery ||
        table.tableName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchArea && matchSearch;
    });
  }, [tables, selectedStatus, selectedArea, searchQuery]);

  return (
    <AppLayout title="Giám sát & vận hành sơ đồ bàn ăn">
      <div className="flex flex-col gap-4 h-full">
        {/* Thanh công cụ Lọc & Tìm kiếm */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tìm kiếm tên bàn */}
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Tìm tên bàn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-xl text-sm bg-surface focus:outline-none focus:border-primary"
              />
              <Icon
                name="Search"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
            </div>

            {/* Lọc Trạng thái */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-xl text-sm bg-surface text-on-surface focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Tất cả trạng thái</option>
              {Object.entries(TableStatusLabel).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Lọc Khu vực */}
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-2 border border-outline-variant rounded-xl text-sm bg-surface text-on-surface focus:outline-none focus:border-primary font-medium"
            >
              <option value="ALL">Tất cả khu vực</option>
              {Object.entries(TableAreaLabel).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Thống kê nhanh */}
          <div className="flex items-center gap-4 text-xs font-semibold text-on-surface-variant">
            <span>
              Tổng: <b className="text-on-surface">{tables.length}</b> bàn
            </span>
            <span>
              Trống:{" "}
              <b className="text-success">
                {
                  tables.filter((t) => t.status === TableStatus.AVAILABLE)
                    .length
                }
              </b>
            </span>
            <span>
              Đang dùng:{" "}
              <b className="text-primary">
                {tables.filter((t) => t.status === TableStatus.OCCUPIED).length}
              </b>
            </span>
          </div>
        </div>

        {/* Lưới Sơ đồ bàn */}
        <div className="flex-1 overflow-y-auto">
          <TableGrid
            tables={filteredTables}
            selectedTableId={selectedTable?.id}
            isLoading={isLoading}
            isError={isError}
            onSelectTable={(tableId) => {
              const target = tables.find((t) => t.id === tableId);
              if (target) setSelectedTable(target);
            }}
            onRetry={refetch}
          />
        </div>
      </div>
    </AppLayout>
  );
}
